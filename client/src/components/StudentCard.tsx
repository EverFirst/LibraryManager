import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StudentCardProps {
  id: string;
  name: string;
  grade: number;
  class: number;
  number: number;
  borrowedCount: number;
  onViewDetails?: () => void;
}

export default function StudentCard({
  name,
  grade,
  class: classNum,
  number,
  borrowedCount,
  onViewDetails,
}: StudentCardProps) {
  const initials = name.substring(0, 1);

  return (
    <Card className="hover-elevate overflow-visible">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {grade}학년 {classNum}반 {number}번
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                대여 중: {borrowedCount}권
              </Badge>
            </div>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={() => {
            console.log("View student details");
            onViewDetails?.();
          }}
          data-testid={`button-student-details-${name}`}
        >
          상세보기
        </Button>
      </CardContent>
    </Card>
  );
}
