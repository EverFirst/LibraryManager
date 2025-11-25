import { useQuery } from "@tanstack/react-query";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/RecentActivity";
import OverdueAlert from "@/components/OverdueAlert";

interface Stats {
  totalBooks: number;
  borrowedBooks: number;
  overdueBooks: number;
}

interface Activity {
  id: string;
  studentName: string;
  bookTitle: string;
  action: string;
  timestamp: string;
}

interface OverdueItem {
  id: string;
  studentName: string;
  bookTitle: string;
  dueDate: string;
}

export default function Dashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/recent-activities"],
  });

  const { data: overdueItems = [] } = useQuery<OverdueItem[]>({
    queryKey: ["/api/overdue-items"],
  });

  return (
    <div className="space-y-8">
      <DashboardStats
        totalBooks={stats?.totalBooks || 0}
        borrowedBooks={stats?.borrowedBooks || 0}
        overdueBooks={stats?.overdueBooks || 0}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity
            activities={activities.map((a: any) => ({
              ...a,
              timestamp: new Date(a.timestamp),
            }))}
          />
        </div>
        <div>
          <OverdueAlert
            overdueItems={overdueItems.map((item: any) => ({
              ...item,
              dueDate: new Date(item.dueDate),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
