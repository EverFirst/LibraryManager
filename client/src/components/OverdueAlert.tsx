import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { differenceInDays } from "date-fns";

interface OverdueItem {
  id: string;
  studentName: string;
  bookTitle: string;
  dueDate: Date;
}

interface OverdueAlertProps {
  overdueItems: OverdueItem[];
}

export default function OverdueAlert({ overdueItems }: OverdueAlertProps) {
  if (overdueItems.length === 0) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-destructive">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <AlertCircle className="text-destructive" size={24} />
        <CardTitle className="text-2xl font-semibold">연체 알림</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {overdueItems.map((item) => {
            const daysOverdue = differenceInDays(
              new Date(),
              item.dueDate
            );
            return (
              <div
                key={item.id}
                className="p-4 bg-destructive/5 rounded-lg border border-destructive/20"
              >
                <p className="font-semibold">{item.studentName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.bookTitle}
                </p>
                <p className="text-sm text-destructive font-medium mt-2">
                  {daysOverdue}일 연체
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
