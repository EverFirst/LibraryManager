import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  year: string;
  quantity: string;
  description: string;
}

interface AddBookFormProps {
  onSubmit?: (data: BookFormData) => void;
  onCancel?: () => void;
  initialData?: BookFormData;
  submitLabel?: string;
}

const defaultFormData: BookFormData = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  category: "",
  year: "",
  quantity: "1",
  description: "",
};

export default function AddBookForm({ onSubmit, onCancel, initialData, submitLabel = "도서 추가" }: AddBookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(initialData || defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onSubmit?.(formData);
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                제목 *
              </Label>
              <Input
                id="title"
                placeholder="도서 제목을 입력하세요"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                data-testid="input-book-title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">
                저자 *
              </Label>
              <Input
                id="author"
                placeholder="저자명을 입력하세요"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                data-testid="input-book-author"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn" className="text-sm font-medium">
                ISBN
              </Label>
              <Input
                id="isbn"
                placeholder="ISBN을 입력하세요"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                data-testid="input-book-isbn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher" className="text-sm font-medium">
                출판사
              </Label>
              <Input
                id="publisher"
                placeholder="출판사를 입력하세요"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                data-testid="input-book-publisher"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                분류 *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category" data-testid="select-book-category">
                  <SelectValue placeholder="분류를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction">문학</SelectItem>
                  <SelectItem value="science">과학</SelectItem>
                  <SelectItem value="history">역사</SelectItem>
                  <SelectItem value="art">예술</SelectItem>
                  <SelectItem value="etc">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">
                출판년도
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                data-testid="input-book-year"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                수량 *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                data-testid="input-book-quantity"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              설명
            </Label>
            <Textarea
              id="description"
              placeholder="도서에 대한 간단한 설명을 입력하세요"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              data-testid="input-book-description"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log("Cancel clicked");
                onCancel?.();
              }}
              data-testid="button-cancel-book"
            >
              취소
            </Button>
            <Button type="submit" data-testid="button-submit-book">
              {submitLabel}
            </Button>
          </div>
        </form>
    </div>
  );
}
