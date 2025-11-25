import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BorrowForm from "@/components/BorrowForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Borrow() {
  const [returnSearch, setReturnSearch] = useState("");

  const mockBorrowedBooks = [
    {
      id: "1",
      bookTitle: "해리포터와 마법사의 돌",
      author: "J.K. 롤링",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
    },
    {
      id: "2",
      bookTitle: "어린왕자",
      author: "생텍쥐페리",
      borrowDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 11),
    },
  ];

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
          <BorrowForm />
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
                  placeholder="학생 이름 또는 번호로 검색"
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
                {mockBorrowedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 border rounded-lg hover-elevate overflow-visible"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{book.bookTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {book.author}
                        </p>
                      </div>
                      <Badge variant="secondary">대여중</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      반납 예정: {book.dueDate.toLocaleDateString("ko-KR")}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => console.log("Return book:", book.id)}
                      data-testid={`button-return-${book.id}`}
                    >
                      반납 처리
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
