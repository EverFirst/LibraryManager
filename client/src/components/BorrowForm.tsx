import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar } from "lucide-react";
import { addDays, format } from "date-fns";
import { ko } from "date-fns/locale";

interface BorrowFormProps {
  onSubmit?: (data: any) => void;
}

export default function BorrowForm({ onSubmit }: BorrowFormProps) {
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const dueDate = addDays(new Date(), 14);

  const mockStudents = [
    { id: "1", name: "김민지", grade: 3, class: 2, number: 5 },
    { id: "2", name: "이준호", grade: 4, class: 1, number: 12 },
  ];

  const mockBooks = [
    { id: "1", title: "해리포터와 마법사의 돌", author: "J.K. 롤링" },
    { id: "2", title: "어린왕자", author: "생텍쥐페리" },
  ];

  const handleSubmit = () => {
    console.log("Borrow submitted:", { selectedStudent, selectedBook, dueDate });
    onSubmit?.({ selectedStudent, selectedBook, dueDate });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">도서 대여</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                학생 검색
              </Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="학생 이름 또는 번호로 검색"
                  className="pl-10"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  data-testid="input-search-student"
                />
              </div>
            </div>
            <div className="space-y-2">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 border rounded-lg cursor-pointer hover-elevate active-elevate-2 ${
                    selectedStudent?.id === student.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedStudent(student)}
                  data-testid={`card-student-${student.id}`}
                >
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.grade}학년 {student.class}반 {student.number}번
                  </p>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={!selectedStudent}
              onClick={() => setStep(2)}
              data-testid="button-next-step"
            >
              다음
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                도서 검색
              </Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="도서명 또는 저자로 검색"
                  className="pl-10"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  data-testid="input-search-book"
                />
              </div>
            </div>
            <div className="space-y-2">
              {mockBooks.map((book) => (
                <div
                  key={book.id}
                  className={`p-4 border rounded-lg cursor-pointer hover-elevate active-elevate-2 ${
                    selectedBook?.id === book.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedBook(book)}
                  data-testid={`card-book-${book.id}`}
                >
                  <p className="font-semibold">{book.title}</p>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <Badge variant="default" className="mt-2">
                    대여가능
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
                data-testid="button-prev-step"
              >
                이전
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedBook}
                onClick={() => setStep(3)}
                data-testid="button-next-step"
              >
                다음
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-6 bg-muted/30 rounded-lg space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">학생</p>
                <p className="font-semibold text-lg">
                  {selectedStudent?.name} ({selectedStudent?.grade}학년{" "}
                  {selectedStudent?.class}반)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">도서</p>
                <p className="font-semibold text-lg">{selectedBook?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedBook?.author}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Calendar size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">반납 예정일</p>
                  <p className="font-semibold">
                    {format(dueDate, "PPP", { locale: ko })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(2)}
                data-testid="button-prev-step"
              >
                이전
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                data-testid="button-submit-borrow"
              >
                대여 처리
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
