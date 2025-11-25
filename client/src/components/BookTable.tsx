import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: "available" | "borrowed";
}

interface BookTableProps {
  books: Book[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BookTable({
  books,
  onView,
  onEdit,
  onDelete,
}: BookTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">제목</TableHead>
            <TableHead className="font-semibold">저자</TableHead>
            <TableHead className="font-semibold">ISBN</TableHead>
            <TableHead className="font-semibold">분류</TableHead>
            <TableHead className="font-semibold">상태</TableHead>
            <TableHead className="font-semibold text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book, index) => (
            <TableRow
              key={book.id}
              className={index % 2 === 0 ? "bg-muted/10" : ""}
            >
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell className="text-muted-foreground">
                {book.isbn}
              </TableCell>
              <TableCell>{book.category}</TableCell>
              <TableCell>
                <Badge
                  variant={book.status === "available" ? "default" : "secondary"}
                >
                  {book.status === "available" ? "대여가능" : "대여중"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      console.log("View book:", book.id);
                      onView?.(book.id);
                    }}
                    data-testid={`button-view-${book.id}`}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      console.log("Edit book:", book.id);
                      onEdit?.(book.id);
                    }}
                    data-testid={`button-edit-${book.id}`}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      console.log("Delete book:", book.id);
                      onDelete?.(book.id);
                    }}
                    data-testid={`button-delete-${book.id}`}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
