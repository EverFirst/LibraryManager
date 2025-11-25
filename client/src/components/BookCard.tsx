import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  status: "available" | "borrowed";
  onAction?: () => void;
}

export default function BookCard({
  title,
  author,
  status,
  onAction,
}: BookCardProps) {
  return (
    <Card className="hover-elevate overflow-visible">
      <CardContent className="p-4">
        <div className="aspect-[2/3] bg-muted rounded-lg mb-4 flex items-center justify-center">
          <BookOpen size={48} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{author}</p>
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={status === "available" ? "default" : "secondary"}
            className="text-sm"
          >
            {status === "available" ? "대여가능" : "대여중"}
          </Badge>
          <Button
            size="sm"
            onClick={() => {
              console.log("Book action clicked");
              onAction?.();
            }}
            data-testid={`button-book-action-${title}`}
          >
            상세보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
