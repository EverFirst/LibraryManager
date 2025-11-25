import { Card } from "@/components/ui/card";
import { BookOpen, Users, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="text-primary opacity-60">{icon}</div>
      </div>
    </Card>
  );
}

interface DashboardStatsProps {
  totalBooks: number;
  borrowedBooks: number;
  overdueBooks: number;
}

export default function DashboardStats({
  totalBooks,
  borrowedBooks,
  overdueBooks,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="총 도서 수"
        value={totalBooks}
        icon={<BookOpen size={48} />}
      />
      <StatCard
        title="대여 중"
        value={borrowedBooks}
        icon={<BookOpen size={48} />}
      />
      <StatCard
        title="연체 도서"
        value={overdueBooks}
        icon={<AlertCircle size={48} />}
      />
    </div>
  );
}
