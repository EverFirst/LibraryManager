import StudentCard from '../StudentCard'

export default function StudentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      <StudentCard
        id="1"
        name="김민지"
        grade={3}
        class={2}
        number={5}
        borrowedCount={2}
      />
      <StudentCard
        id="2"
        name="이준호"
        grade={4}
        class={1}
        number={12}
        borrowedCount={1}
      />
    </div>
  )
}
