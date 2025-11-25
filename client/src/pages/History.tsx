import { useState } from "react";
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

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockHistory = [
    {
      id: "1",
      studentName: "김민지",
      studentInfo: "3학년 2반 5번",
      bookTitle: "해리포터와 마법사의 돌",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      returnDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      status: "returned" as const,
    },
    {
      id: "2",
      studentName: "이준호",
      studentInfo: "4학년 1반 12번",
      bookTitle: "어린왕자",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      returnDate: null,
      status: "borrowed" as const,
    },
    {
      id: "3",
      studentName: "박서연",
      studentInfo: "3학년 1반 8번",
      bookTitle: "아낌없이 주는 나무",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      returnDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      status: "returned" as const,
    },
    {
      id: "4",
      studentName: "강지우",
      studentInfo: "3학년 2반 3번",
      bookTitle: "그리스 로마 신화",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
      returnDate: null,
      status: "overdue" as const,
    },
    {
      id: "5",
      studentName: "최하은",
      studentInfo: "5학년 3반 15번",
      bookTitle: "마당을 나온 암탉",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      returnDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      status: "returned" as const,
    },
  ];

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
            {mockHistory.map((record, index) => (
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
                <TableCell className="font-medium">{record.bookTitle}</TableCell>
                <TableCell>
                  {format(record.borrowDate, "PPP", { locale: ko })}
                </TableCell>
                <TableCell>
                  {record.returnDate
                    ? format(record.returnDate, "PPP", { locale: ko })
                    : "-"}
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
