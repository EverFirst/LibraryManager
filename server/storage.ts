import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, like, or, and, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  InsertBook,
  Book,
  InsertStudent,
  Student,
  InsertBorrowRecord,
  BorrowRecord,
  User,
  UpsertUser,
} from "@shared/schema";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

export interface IStorage {
  // User operations (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Book operations
  createBook(book: InsertBook): Promise<Book>;
  getBook(id: string): Promise<Book | undefined>;
  getBooks(): Promise<Book[]>;
  searchBooks(query: string): Promise<Book[]>;
  updateBook(id: string, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: string): Promise<boolean>;

  // Student operations
  createStudent(student: InsertStudent): Promise<Student>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudents(): Promise<Student[]>;
  searchStudents(query: string): Promise<Student[]>;
  updateStudent(
    id: string,
    student: Partial<InsertStudent>
  ): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;

  // Borrow operations
  createBorrowRecord(record: InsertBorrowRecord): Promise<BorrowRecord>;
  getBorrowRecord(id: string): Promise<BorrowRecord | undefined>;
  getBorrowRecords(): Promise<BorrowRecord[]>;
  getActiveBorrowRecords(): Promise<BorrowRecord[]>;
  getBorrowRecordsByStudent(studentId: string): Promise<BorrowRecord[]>;
  getBorrowRecordsByBook(bookId: string): Promise<BorrowRecord[]>;
  returnBook(recordId: string): Promise<BorrowRecord | undefined>;
  
  // Dashboard stats
  getStats(): Promise<{
    totalBooks: number;
    borrowedBooks: number;
    overdueBooks: number;
  }>;
  
  getRecentActivities(): Promise<Array<{
    id: string;
    studentName: string;
    bookTitle: string;
    action: string;
    timestamp: string;
  }>>;
  
  getOverdueItems(): Promise<Array<{
    id: string;
    studentName: string;
    bookTitle: string;
    dueDate: string;
  }>>;
}

export class DbStorage implements IStorage {
  // User operations (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(userData)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Book operations
  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db
      .insert(schema.books)
      .values({
        ...insertBook,
        available: insertBook.quantity,
      })
      .returning();
    return book;
  }

  async getBook(id: string): Promise<Book | undefined> {
    const [book] = await db
      .select()
      .from(schema.books)
      .where(eq(schema.books.id, id));
    return book;
  }

  async getBooks(): Promise<Book[]> {
    return await db.select().from(schema.books).orderBy(schema.books.createdAt);
  }

  async searchBooks(query: string): Promise<Book[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(schema.books)
      .where(
        or(
          like(schema.books.title, searchTerm),
          like(schema.books.author, searchTerm),
          like(schema.books.category, searchTerm)
        )
      )
      .orderBy(schema.books.createdAt);
  }

  async updateBook(
    id: string,
    bookUpdate: Partial<InsertBook>
  ): Promise<Book | undefined> {
    const currentBook = await this.getBook(id);
    if (!currentBook) return undefined;
    
    const updateData: any = { ...bookUpdate };
    
    if (bookUpdate.quantity !== undefined) {
      const borrowed = currentBook.quantity - currentBook.available;
      updateData.available = bookUpdate.quantity - borrowed;
      
      if (updateData.available < 0) {
        throw new Error("Cannot reduce quantity below borrowed count");
      }
    }
    
    const [book] = await db
      .update(schema.books)
      .set(updateData)
      .where(eq(schema.books.id, id))
      .returning();
    return book;
  }

  async deleteBook(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.books)
      .where(eq(schema.books.id, id))
      .returning();
    return result.length > 0;
  }

  // Student operations
  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(schema.students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.id, id));
    return student;
  }

  async getStudents(): Promise<Student[]> {
    return await db
      .select()
      .from(schema.students)
      .orderBy(schema.students.grade, schema.students.class, schema.students.number);
  }

  async searchStudents(query: string): Promise<Student[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(schema.students)
      .where(like(schema.students.name, searchTerm))
      .orderBy(schema.students.grade, schema.students.class, schema.students.number);
  }

  async updateStudent(
    id: string,
    studentUpdate: Partial<InsertStudent>
  ): Promise<Student | undefined> {
    const [student] = await db
      .update(schema.students)
      .set(studentUpdate)
      .where(eq(schema.students.id, id))
      .returning();
    return student;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.students)
      .where(eq(schema.students.id, id))
      .returning();
    return result.length > 0;
  }

  // Borrow operations
  async createBorrowRecord(
    insertRecord: InsertBorrowRecord
  ): Promise<BorrowRecord> {
    const book = await this.getBook(insertRecord.bookId);
    if (!book || book.available <= 0) {
      throw new Error("Book not available");
    }

    const [record] = await db
      .insert(schema.borrowRecords)
      .values(insertRecord)
      .returning();

    await db
      .update(schema.books)
      .set({ available: sql`${schema.books.available} - 1` })
      .where(eq(schema.books.id, insertRecord.bookId));

    return record;
  }

  async getBorrowRecord(id: string): Promise<BorrowRecord | undefined> {
    const [record] = await db
      .select()
      .from(schema.borrowRecords)
      .where(eq(schema.borrowRecords.id, id));
    return record;
  }

  async getBorrowRecords(): Promise<BorrowRecord[]> {
    return await db
      .select()
      .from(schema.borrowRecords)
      .orderBy(sql`${schema.borrowRecords.borrowDate} DESC`);
  }

  async getActiveBorrowRecords(): Promise<BorrowRecord[]> {
    return await db
      .select()
      .from(schema.borrowRecords)
      .where(eq(schema.borrowRecords.status, "borrowed"))
      .orderBy(schema.borrowRecords.dueDate);
  }

  async getBorrowRecordsByStudent(studentId: string): Promise<BorrowRecord[]> {
    return await db
      .select()
      .from(schema.borrowRecords)
      .where(eq(schema.borrowRecords.studentId, studentId))
      .orderBy(sql`${schema.borrowRecords.borrowDate} DESC`);
  }

  async getBorrowRecordsByBook(bookId: string): Promise<BorrowRecord[]> {
    return await db
      .select()
      .from(schema.borrowRecords)
      .where(eq(schema.borrowRecords.bookId, bookId))
      .orderBy(sql`${schema.borrowRecords.borrowDate} DESC`);
  }

  async returnBook(recordId: string): Promise<BorrowRecord | undefined> {
    const record = await this.getBorrowRecord(recordId);
    if (!record || record.status === "returned") {
      throw new Error("Invalid borrow record");
    }

    const [updatedRecord] = await db
      .update(schema.borrowRecords)
      .set({
        returnDate: new Date(),
        status: "returned",
      })
      .where(eq(schema.borrowRecords.id, recordId))
      .returning();

    await db
      .update(schema.books)
      .set({ available: sql`${schema.books.available} + 1` })
      .where(eq(schema.books.id, record.bookId));

    return updatedRecord;
  }

  async getStats(): Promise<{
    totalBooks: number;
    borrowedBooks: number;
    overdueBooks: number;
  }> {
    const [totalBooksResult] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.books);

    const [borrowedBooksResult] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.borrowRecords)
      .where(eq(schema.borrowRecords.status, "borrowed"));

    const [overdueBooksResult] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.borrowRecords)
      .where(
        and(
          eq(schema.borrowRecords.status, "borrowed"),
          sql`${schema.borrowRecords.dueDate} < NOW()`
        )
      );

    return {
      totalBooks: totalBooksResult?.count || 0,
      borrowedBooks: borrowedBooksResult?.count || 0,
      overdueBooks: overdueBooksResult?.count || 0,
    };
  }

  async getRecentActivities(): Promise<Array<{
    id: string;
    studentName: string;
    bookTitle: string;
    action: string;
    timestamp: string;
  }>> {
    const records = await db
      .select({
        id: schema.borrowRecords.id,
        studentId: schema.borrowRecords.studentId,
        bookId: schema.borrowRecords.bookId,
        borrowDate: schema.borrowRecords.borrowDate,
        returnDate: schema.borrowRecords.returnDate,
        status: schema.borrowRecords.status,
      })
      .from(schema.borrowRecords)
      .orderBy(sql`${schema.borrowRecords.borrowDate} DESC`)
      .limit(10);

    const activities = [];
    for (const record of records) {
      const student = await this.getStudent(record.studentId);
      const book = await this.getBook(record.bookId);
      
      if (student && book) {
        if (record.returnDate) {
          activities.push({
            id: `${record.id}-return`,
            studentName: student.name,
            bookTitle: book.title,
            action: "반납",
            timestamp: record.returnDate.toISOString(),
          });
        }
        activities.push({
          id: `${record.id}-borrow`,
          studentName: student.name,
          bookTitle: book.title,
          action: "대여",
          timestamp: record.borrowDate.toISOString(),
        });
      }
    }

    return activities.slice(0, 10);
  }

  async getOverdueItems(): Promise<Array<{
    id: string;
    studentName: string;
    bookTitle: string;
    dueDate: string;
  }>> {
    const overdueRecords = await db
      .select()
      .from(schema.borrowRecords)
      .where(
        and(
          eq(schema.borrowRecords.status, "borrowed"),
          sql`${schema.borrowRecords.dueDate} < NOW()`
        )
      )
      .orderBy(schema.borrowRecords.dueDate);

    const items = [];
    for (const record of overdueRecords) {
      const student = await this.getStudent(record.studentId);
      const book = await this.getBook(record.bookId);
      
      if (student && book) {
        items.push({
          id: record.id,
          studentName: `${student.name} (${student.grade}학년 ${student.class}반)`,
          bookTitle: book.title,
          dueDate: record.dueDate.toISOString(),
        });
      }
    }

    return items;
  }
}

export const storage = new DbStorage();
