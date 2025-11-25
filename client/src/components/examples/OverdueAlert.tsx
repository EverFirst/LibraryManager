import OverdueAlert from '../OverdueAlert'

export default function OverdueAlertExample() {
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

  return <OverdueAlert overdueItems={overdueItems} />
}
