import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookCard from "@/components/BookCard";
import BookTable from "@/components/BookTable";
import AddBookForm from "@/components/AddBookForm";
import { Search, Plus, Grid, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Books() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const mockBooks = [
    {
      id: "1",
      title: "해리포터와 마법사의 돌",
      author: "J.K. 롤링",
      isbn: "978-89-8392-671-4",
      category: "문학",
      status: "available" as const,
    },
    {
      id: "2",
      title: "어린왕자",
      author: "생텍쥐페리",
      isbn: "978-89-324-7208-4",
      category: "문학",
      status: "borrowed" as const,
    },
    {
      id: "3",
      title: "그리스 로마 신화",
      author: "토마스 불핀치",
      isbn: "978-89-255-4897-2",
      category: "역사",
      status: "available" as const,
    },
    {
      id: "4",
      title: "아낌없이 주는 나무",
      author: "셸 실버스타인",
      isbn: "978-89-8392-123-8",
      category: "문학",
      status: "available" as const,
    },
    {
      id: "5",
      title: "마당을 나온 암탉",
      author: "황선미",
      isbn: "978-89-546-0733-4",
      category: "문학",
      status: "borrowed" as const,
    },
    {
      id: "6",
      title: "삼국지",
      author: "나관중",
      isbn: "978-89-372-1234-5",
      category: "역사",
      status: "available" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="도서 검색..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-books"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
              className="rounded-none"
            >
              <Grid size={18} />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              data-testid="button-view-table"
              className="rounded-none"
            >
              <List size={18} />
            </Button>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            data-testid="button-add-book"
          >
            <Plus size={18} />
            <span className="ml-2">도서 추가</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <BookTable books={mockBooks} />
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AddBookForm onCancel={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
