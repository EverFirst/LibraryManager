import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/RecentActivity";
import OverdueAlert from "@/components/OverdueAlert";

export default function Dashboard() {
  const activities = [
    {
      id: "1",
      studentName: "김민지",
      bookTitle: "해리포터와 마법사의 돌",
      action: "대여" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      studentName: "이준호",
      bookTitle: "어린왕자",
      action: "반납" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "3",
      studentName: "박서연",
      bookTitle: "아낌없이 주는 나무",
      action: "대여" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "4",
      studentName: "최하은",
      bookTitle: "마당을 나온 암탉",
      action: "반납" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: "5",
      studentName: "정우진",
      bookTitle: "삼국지",
      action: "대여" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ];

  const overdueItems = [
    {
      id: "1",
      studentName: "강지우 (3학년 2반)",
      bookTitle: "그리스 로마 신화",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: "2",
      studentName: "윤서아 (4학년 1반)",
      bookTitle: "삼국지",
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardStats totalBooks={450} borrowedBooks={87} overdueBooks={5} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <div>
          <OverdueAlert overdueItems={overdueItems} />
        </div>
      </div>
    </div>
  );
}
