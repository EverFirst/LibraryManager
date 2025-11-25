import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookCard from "@/components/BookCard";
import BookTable from "@/components/BookTable";
import AddBookForm from "@/components/AddBookForm";
import { Search, Plus, Grid, List, BookOpen, X, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@shared/schema";

export default function Books() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
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

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      const updateData = {
        title: data.title,
        author: data.author,
        isbn: data.isbn || null,
        publisher: data.publisher || null,
        category: data.category,
        publicationYear: data.year ? parseInt(data.year) : null,
        quantity: parseInt(data.quantity),
        description: data.description || null,
      };
      return apiRequest("PATCH", `/api/books/${id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setShowEditDialog(false);
      setEditingBook(null);
      toast({
        title: "도서가 수정되었습니다",
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

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      fiction: "문학",
      nonfiction: "비문학",
      science: "과학",
      history: "역사",
      art: "예술",
      other: "기타",
    };
    return categories[category] || category;
  };

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("정말로 이 도서를 삭제하시겠습니까?")) {
      deleteBookMutation.mutate(id);
      setSelectedBook(null);
    }
  };

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
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          등록된 도서가 없습니다. 도서를 추가해주세요.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              status={book.available > 0 ? "available" : "borrowed"}
              onAction={() => handleViewBook(book)}
            />
          ))}
        </div>
      ) : (
        <BookTable
          books={books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn || "",
            category: getCategoryLabel(book.category),
            status: book.available > 0 ? ("available" as const) : ("borrowed" as const),
          }))}
          onView={(id) => {
            const book = books.find((b) => b.id === id);
            if (book) handleViewBook(book);
          }}
          onEdit={(id) => {
            const book = books.find((b) => b.id === id);
            if (book) {
              setEditingBook(book);
              setShowEditDialog(true);
            }
          }}
          onDelete={(id) => handleDeleteBook(id)}
        />
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>도서 추가</DialogTitle>
            <DialogDescription>새로운 도서를 등록합니다.</DialogDescription>
          </DialogHeader>
          <AddBookForm
            onSubmit={(data) => createBookMutation.mutate(data)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>도서 상세정보</DialogTitle>
            <DialogDescription>선택한 도서의 상세 정보입니다.</DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-36 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen size={32} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1" data-testid="text-book-detail-title">
                    {selectedBook.title}
                  </h3>
                  <p className="text-muted-foreground mb-2" data-testid="text-book-detail-author">
                    {selectedBook.author}
                  </p>
                  <Badge variant={selectedBook.available > 0 ? "default" : "secondary"}>
                    {selectedBook.available > 0 ? "대여가능" : "대여중"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">ISBN:</span>
                  <p className="font-medium">{selectedBook.isbn || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">출판사:</span>
                  <p className="font-medium">{selectedBook.publisher || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">분류:</span>
                  <p className="font-medium">{getCategoryLabel(selectedBook.category)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">출판년도:</span>
                  <p className="font-medium">{selectedBook.publicationYear || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">총 수량:</span>
                  <p className="font-medium">{selectedBook.quantity}권</p>
                </div>
                <div>
                  <span className="text-muted-foreground">대여 가능:</span>
                  <p className="font-medium">{selectedBook.available}권</p>
                </div>
              </div>

              {selectedBook.description && (
                <div>
                  <span className="text-sm text-muted-foreground">설명:</span>
                  <p className="text-sm mt-1">{selectedBook.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBook(selectedBook.id)}
                  data-testid="button-delete-book"
                >
                  <Trash2 size={16} className="mr-1" />
                  삭제
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingBook(selectedBook);
                    setSelectedBook(null);
                    setShowEditDialog(true);
                  }}
                  data-testid="button-edit-from-detail"
                >
                  <Edit size={16} className="mr-1" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBook(null)}
                  data-testid="button-close-detail"
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowEditDialog(false);
          setEditingBook(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>도서 수정</DialogTitle>
            <DialogDescription>도서 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          {editingBook && (
            <AddBookForm
              initialData={{
                title: editingBook.title,
                author: editingBook.author,
                isbn: editingBook.isbn || "",
                publisher: editingBook.publisher || "",
                category: editingBook.category,
                year: editingBook.publicationYear?.toString() || "",
                quantity: editingBook.quantity.toString(),
                description: editingBook.description || "",
              }}
              onSubmit={(data) => updateBookMutation.mutate({ id: editingBook.id, data })}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingBook(null);
              }}
              submitLabel="수정"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
