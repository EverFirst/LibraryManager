import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Activity {
  id: string;
  studentName: string;
  bookTitle: string;
  action: "대여" | "반납";
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg ${
                index % 2 === 0 ? "bg-muted/30" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {activity.studentName}
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      - {activity.bookTitle}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.action} •{" "}
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    activity.action === "대여"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {activity.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
