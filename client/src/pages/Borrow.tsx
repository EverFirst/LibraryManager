import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar } from "lucide-react";
import { addDays, format } from "date-fns";
import { ko } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Student, Book, BorrowRecord } from "@shared/schema";

export default function Borrow() {
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [returnSearch, setReturnSearch] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const { data: borrowRecords = [] } = useQuery<BorrowRecord[]>({
    queryKey: ["/api/borrow-records", "active"],
    queryFn: async () => {
      const response = await fetch("/api/borrow-records?active=true");
      return response.json();
    },
  });

  const borrowMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/borrow-records", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/borrow-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setStep(1);
      setSelectedStudent(null);
      setSelectedBook(null);
      toast({
        title: "대여가 완료되었습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류가 발생했습니다",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/borrow-records/${id}/return`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/borrow-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setSelectedRecords([]);
      toast({
        title: "반납이 완료되었습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류가 발생했습니다",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const dueDate = addDays(new Date(), 14);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const availableBooks = books.filter((b) => b.available > 0);
  const filteredBooks = availableBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const handleBorrow = () => {
    if (!selectedStudent || !selectedBook) return;
    borrowMutation.mutate({
      studentId: selectedStudent.id,
      bookId: selectedBook.id,
      dueDate: dueDate.toISOString(),
    });
  };

  const recordsWithDetails = borrowRecords.map((record) => {
    const student = students.find((s) => s.id === record.studentId);
    const book = books.find((b) => b.id === record.bookId);
    return { record, student, book };
  });

  const filteredRecords = recordsWithDetails.filter(
    ({ student }) =>
      student &&
      student.name.toLowerCase().includes(returnSearch.toLowerCase())
  );

  return (
    <Tabs defaultValue="borrow" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="borrow" data-testid="tab-borrow">
          도서 대여
        </TabsTrigger>
        <TabsTrigger value="return" data-testid="tab-return">
          도서 반납
        </TabsTrigger>
      </TabsList>

      <TabsContent value="borrow" className="mt-6">
        <div className="max-w-2xl mx-auto">
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
                        placeholder="학생 이름으로 검색"
                        className="pl-10"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        data-testid="input-search-student"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-4 border rounded-lg cursor-pointer hover-elevate active-elevate-2 overflow-visible ${
                          selectedStudent?.id === student.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => setSelectedStudent(student)}
                        data-testid={`card-student-${student.id}`}
                      >
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.grade}학년 {student.class}반 {student.number}
                          번
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
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredBooks.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        대여 가능한 도서가 없습니다
                      </p>
                    ) : (
                      filteredBooks.map((book) => (
                        <div
                          key={book.id}
                          className={`p-4 border rounded-lg cursor-pointer hover-elevate active-elevate-2 overflow-visible ${
                            selectedBook?.id === book.id
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => setSelectedBook(book)}
                          data-testid={`card-book-${book.id}`}
                        >
                          <p className="font-semibold">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>
                          <Badge variant="default" className="mt-2">
                            대여가능 ({book.available}권)
                          </Badge>
                        </div>
                      ))
                    )}
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

              {step === 3 && selectedStudent && selectedBook && (
                <div className="space-y-4">
                  <div className="p-6 bg-muted/30 rounded-lg space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">학생</p>
                      <p className="font-semibold text-lg">
                        {selectedStudent.name} ({selectedStudent.grade}학년{" "}
                        {selectedStudent.class}반)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">도서</p>
                      <p className="font-semibold text-lg">
                        {selectedBook.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedBook.author}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Calendar size={20} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          반납 예정일
                        </p>
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
                      onClick={handleBorrow}
                      disabled={borrowMutation.isPending}
                      data-testid="button-submit-borrow"
                    >
                      {borrowMutation.isPending ? "처리 중..." : "대여 처리"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="return" className="mt-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">도서 반납</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="학생 이름으로 검색"
                  className="pl-10"
                  value={returnSearch}
                  onChange={(e) => setReturnSearch(e.target.value)}
                  data-testid="input-return-search"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  대여 중인 도서
                </p>
                {filteredRecords.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    대여 중인 도서가 없습니다
                  </p>
                ) : (
                  filteredRecords.map(({ record, student, book }) => (
                    <div
                      key={record.id}
                      className="p-4 border rounded-lg hover-elevate overflow-visible"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">
                            {student?.name} ({student?.grade}학년{" "}
                            {student?.class}반)
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {book?.title}
                          </p>
                        </div>
                        <Badge variant="secondary">대여중</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        반납 예정:{" "}
                        {format(new Date(record.dueDate), "PPP", {
                          locale: ko,
                        })}
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => returnMutation.mutate(record.id)}
                        disabled={returnMutation.isPending}
                        data-testid={`button-return-${record.id}`}
                      >
                        {returnMutation.isPending ? "처리 중..." : "반납 처리"}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
