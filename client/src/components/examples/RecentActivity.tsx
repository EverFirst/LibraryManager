import RecentActivity from '../RecentActivity'

export default function RecentActivityExample() {
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
  ];

  return <RecentActivity activities={activities} />
}
