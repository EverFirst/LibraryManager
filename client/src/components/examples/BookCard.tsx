import BookCard from '../BookCard'

export default function BookCardExample() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-2xl">
      <BookCard
        id="1"
        title="해리포터와 마법사의 돌"
        author="J.K. 롤링"
        status="available"
      />
      <BookCard
        id="2"
        title="어린왕자"
        author="생텍쥐페리"
        status="borrowed"
      />
    </div>
  )
}
