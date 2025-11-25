import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StudentCard from "@/components/StudentCard";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@shared/schema";

interface StudentWithBorrowCount extends Student {
  borrowedCount: number;
}

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    class: "",
    number: "",
  });
  const { toast } = useToast();

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students", searchQuery],
    queryFn: async () => {
      const url = searchQuery
        ? `/api/students?search=${encodeURIComponent(searchQuery)}`
        : "/api/students";
      const response = await fetch(url);
      return response.json();
    },
  });

  const { data: borrowRecords = [] } = useQuery({
    queryKey: ["/api/borrow-records"],
    queryFn: async () => {
      const response = await fetch("/api/borrow-records?active=true");
      return response.json();
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/students", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setShowAddDialog(false);
      setFormData({ name: "", grade: "", class: "", number: "" });
      toast({
        title: "학생이 추가되었습니다",
      });
    },
    onError: (error: any) => {
      toast({
        title: "오류가 발생했습니다",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const studentsWithCounts: StudentWithBorrowCount[] = students.map(
    (student) => ({
      ...student,
      borrowedCount: borrowRecords.filter(
        (r: any) => r.studentId === student.id
      ).length,
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate({
      name: formData.name,
      grade: parseInt(formData.grade),
      class: parseInt(formData.class),
      number: parseInt(formData.number),
    });
  };

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
        <Button
          onClick={() => setShowAddDialog(true)}
          data-testid="button-add-student"
        >
          <Plus size={18} />
          <span className="ml-2">학생 추가</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          로딩 중...
        </div>
      ) : studentsWithCounts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          등록된 학생이 없습니다. 학생을 추가해주세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsWithCounts.map((student) => (
            <StudentCard key={student.id} {...student} />
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              학생 추가
            </DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="학생 이름"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    data-testid="input-student-name"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">학년 *</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="1"
                      max="6"
                      placeholder="학년"
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      data-testid="input-student-grade"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">반 *</Label>
                    <Input
                      id="class"
                      type="number"
                      min="1"
                      placeholder="반"
                      value={formData.class}
                      onChange={(e) =>
                        setFormData({ ...formData, class: e.target.value })
                      }
                      data-testid="input-student-class"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">번호 *</Label>
                    <Input
                      id="number"
                      type="number"
                      min="1"
                      placeholder="번호"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      data-testid="input-student-number"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    data-testid="button-cancel-student"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={createStudentMutation.isPending}
                    data-testid="button-submit-student"
                  >
                    {createStudentMutation.isPending ? "추가 중..." : "학생 추가"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
