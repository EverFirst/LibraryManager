import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookCard from "@/components/BookCard";
import BookTable from "@/components/BookTable";
import AddBookForm from "@/components/AddBookForm";
import { Search, Plus, Grid, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@shared/schema";

export default function Books() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books", searchQuery],
    queryFn: async () => {
      const url = searchQuery
        ? `/api/books?search=${encodeURIComponent(searchQuery)}`
        : "/api/books";
      const response = await fetch(url);
      return response.json();
    },
  });

  const createBookMutation = useMutation({
    mutationFn: (formData: any) => {
      const data = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        category: formData.category,
        publicationYear: formData.year ? parseInt(formData.year) : null,
        quantity: parseInt(formData.quantity),
        description: formData.description || null,
      };
      return apiRequest("POST", "/api/books", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setShowAddDialog(false);
      toast({
        title: "도서가 추가되었습니다",
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

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "도서가 삭제되었습니다",
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

  const booksWithStatus = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn || "",
    category: book.category,
    status: book.available > 0 ? ("available" as const) : ("borrowed" as const),
  }));

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

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          로딩 중...
        </div>
      ) : booksWithStatus.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          등록된 도서가 없습니다. 도서를 추가해주세요.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {booksWithStatus.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <BookTable
          books={booksWithStatus}
          onDelete={(id) => deleteBookMutation.mutate(id)}
        />
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AddBookForm
            onSubmit={(data) => createBookMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
