import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudentCard from "@/components/StudentCard";
import { Search, Plus } from "lucide-react";

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockStudents = [
    {
      id: "1",
      name: "김민지",
      grade: 3,
      class: 2,
      number: 5,
      borrowedCount: 2,
    },
    {
      id: "2",
      name: "이준호",
      grade: 4,
      class: 1,
      number: 12,
      borrowedCount: 1,
    },
    {
      id: "3",
      name: "박서연",
      grade: 3,
      class: 1,
      number: 8,
      borrowedCount: 0,
    },
    {
      id: "4",
      name: "최하은",
      grade: 5,
      class: 3,
      number: 15,
      borrowedCount: 3,
    },
    {
      id: "5",
      name: "정우진",
      grade: 4,
      class: 2,
      number: 20,
      borrowedCount: 1,
    },
    {
      id: "6",
      name: "강지우",
      grade: 3,
      class: 2,
      number: 3,
      borrowedCount: 2,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="학생 검색..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-students"
          />
        </div>
        <Button data-testid="button-add-student">
          <Plus size={18} />
          <span className="ml-2">학생 추가</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStudents.map((student) => (
          <StudentCard key={student.id} {...student} />
        ))}
      </div>
    </div>
  );
}
