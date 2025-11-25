import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { BorrowRecord, Student, Book } from "@shared/schema";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: borrowRecords = [], isLoading } = useQuery<BorrowRecord[]>({
    queryKey: ["/api/borrow-records"],
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const recordsWithDetails = borrowRecords.map((record) => {
    const student = students.find((s) => s.id === record.studentId);
    const book = books.find((b) => b.id === record.bookId);
    
    let status: "borrowed" | "returned" | "overdue" = "borrowed";
    if (record.returnDate) {
      status = "returned";
    } else if (new Date(record.dueDate) < new Date() && !record.returnDate) {
      status = "overdue";
    }

    return {
      ...record,
      studentName: student?.name || "Unknown",
      studentInfo: student
        ? `${student.grade}학년 ${student.class}반 ${student.number}번`
        : "",
      bookTitle: book?.title || "Unknown",
      status,
    };
  });

  const filteredRecords = recordsWithDetails.filter(
    (record) =>
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "borrowed":
        return <Badge variant="default">대여중</Badge>;
      case "returned":
        return <Badge variant="secondary">반납완료</Badge>;
      case "overdue":
        return <Badge variant="destructive">연체</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          placeholder="학생 또는 도서 검색..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-history"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          로딩 중...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          대여 이력이 없습니다.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">학생</TableHead>
                <TableHead className="font-semibold">도서</TableHead>
                <TableHead className="font-semibold">대여일</TableHead>
                <TableHead className="font-semibold">반납일</TableHead>
                <TableHead className="font-semibold">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow
                  key={record.id}
                  className={index % 2 === 0 ? "bg-muted/10" : ""}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.studentInfo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.bookTitle}
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.borrowDate), "PPP", { locale: ko })}
                  </TableCell>
                  <TableCell>
                    {record.returnDate
                      ? format(new Date(record.returnDate), "PPP", {
                          locale: ko,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
