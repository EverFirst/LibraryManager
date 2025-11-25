import BookTable from '../BookTable'

export default function BookTableExample() {
  const books = [
    {
      id: "1",
      title: "해리포터와 마법사의 돌",
      author: "J.K. 롤링",
      isbn: "978-89-8392-671-4",
      category: "문학",
      status: "available" as const,
    },
    {
      id: "2",
      title: "어린왕자",
      author: "생텍쥐페리",
      isbn: "978-89-324-7208-4",
      category: "문학",
      status: "borrowed" as const,
    },
    {
      id: "3",
      title: "그리스 로마 신화",
      author: "토마스 불핀치",
      isbn: "978-89-255-4897-2",
      category: "역사",
      status: "available" as const,
    },
  ];

  return <BookTable books={books} />
}
