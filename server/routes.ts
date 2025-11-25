import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertStudentSchema, insertBorrowRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/recent-activities", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/overdue-items", async (req, res) => {
    try {
      const overdueItems = await storage.getOverdueItems();
      res.json(overdueItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Book routes
  app.get("/api/books", async (req, res) => {
    try {
      const { search } = req.query;
      const books = search
        ? await storage.searchBooks(search as string)
        : await storage.getBooks();
      res.json(books);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(book);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const bookData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/books/:id", async (req, res) => {
    try {
      const bookData = insertBookSchema.partial().parse(req.body);
      const book = await storage.updateBook(req.params.id, bookData);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(book);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/books/:id", async (req, res) => {
    try {
      const bookData = insertBookSchema.partial().parse(req.body);
      const book = await storage.updateBook(req.params.id, bookData);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(book);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBook(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const { search } = req.query;
      const students = search
        ? await storage.searchStudents(search as string)
        : await storage.getStudents();
      res.json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    try {
      const studentData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(req.params.id, studentData);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStudent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Borrow record routes
  app.get("/api/borrow-records", async (req, res) => {
    try {
      const { studentId, bookId, active } = req.query;
      
      let records;
      if (studentId) {
        records = await storage.getBorrowRecordsByStudent(studentId as string);
      } else if (bookId) {
        records = await storage.getBorrowRecordsByBook(bookId as string);
      } else if (active === "true") {
        records = await storage.getActiveBorrowRecords();
      } else {
        records = await storage.getBorrowRecords();
      }
      
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/borrow-records/:id", async (req, res) => {
    try {
      const record = await storage.getBorrowRecord(req.params.id);
      if (!record) {
        return res.status(404).json({ error: "Borrow record not found" });
      }
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/borrow-records", async (req, res) => {
    try {
      const recordData = insertBorrowRecordSchema.parse(req.body);
      const record = await storage.createBorrowRecord(recordData);
      res.status(201).json(record);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/borrow-records/:id/return", async (req, res) => {
    try {
      const record = await storage.returnBook(req.params.id);
      if (!record) {
        return res.status(404).json({ error: "Borrow record not found" });
      }
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get student with borrow count
  app.get("/api/students/:id/borrow-count", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      
      const activeRecords = await storage.getBorrowRecordsByStudent(req.params.id);
      const borrowedCount = activeRecords.filter(r => r.status === "borrowed").length;
      
      res.json({ ...student, borrowedCount });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get recent activities
  app.get("/api/recent-activities", async (req, res) => {
    try {
      const records = await storage.getBorrowRecords();
      const activities = await Promise.all(
        records.slice(0, 10).map(async (record) => {
          const student = await storage.getStudent(record.studentId);
          const book = await storage.getBook(record.bookId);
          
          return {
            id: record.id,
            studentName: student?.name || "Unknown",
            bookTitle: book?.title || "Unknown",
            action: record.returnDate ? "반납" : "대여",
            timestamp: record.returnDate || record.borrowDate,
          };
        })
      );
      
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get overdue items
  app.get("/api/overdue-items", async (req, res) => {
    try {
      const activeRecords = await storage.getActiveBorrowRecords();
      const now = new Date();
      
      const overdueItems = await Promise.all(
        activeRecords
          .filter(record => new Date(record.dueDate) < now)
          .map(async (record) => {
            const student = await storage.getStudent(record.studentId);
            const book = await storage.getBook(record.bookId);
            
            return {
              id: record.id,
              studentName: student ? `${student.name} (${student.grade}학년 ${student.class}반)` : "Unknown",
              bookTitle: book?.title || "Unknown",
              dueDate: record.dueDate,
            };
          })
      );
      
      res.json(overdueItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
