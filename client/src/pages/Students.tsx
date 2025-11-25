import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StudentCard from "@/components/StudentCard";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@shared/schema";

interface StudentWithBorrowCount extends Student {
  borrowedCount: number;
}

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithBorrowCount | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentWithBorrowCount | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    class: "",
    number: "",
  });
  const [editFormData, setEditFormData] = useState({
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

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PUT", `/api/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setShowEditDialog(false);
      setEditingStudent(null);
      toast({
        title: "학생 정보가 수정되었습니다",
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

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setSelectedStudent(null);
      toast({
        title: "학생이 삭제되었습니다",
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudentMutation.mutate({
      id: editingStudent.id,
      data: {
        name: editFormData.name,
        grade: parseInt(editFormData.grade),
        class: parseInt(editFormData.class),
        number: parseInt(editFormData.number),
      },
    });
  };

  const handleViewStudent = (student: StudentWithBorrowCount) => {
    setSelectedStudent(student);
  };

  const handleEditStudent = (student: StudentWithBorrowCount) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      grade: student.grade.toString(),
      class: student.class.toString(),
      number: student.number.toString(),
    });
    setShowEditDialog(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("정말로 이 학생을 삭제하시겠습니까?")) {
      deleteStudentMutation.mutate(id);
    }
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
            <StudentCard
              key={student.id}
              {...student}
              onViewDetails={() => handleViewStudent(student)}
            />
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

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>학생 상세정보</DialogTitle>
            <DialogDescription>선택한 학생의 상세 정보입니다.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold" data-testid="text-student-detail-name">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedStudent.grade}학년 {selectedStudent.class}반 {selectedStudent.number}번
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">학년:</span>
                  <p className="font-medium">{selectedStudent.grade}학년</p>
                </div>
                <div>
                  <span className="text-muted-foreground">반:</span>
                  <p className="font-medium">{selectedStudent.class}반</p>
                </div>
                <div>
                  <span className="text-muted-foreground">번호:</span>
                  <p className="font-medium">{selectedStudent.number}번</p>
                </div>
                <div>
                  <span className="text-muted-foreground">대여 중:</span>
                  <p className="font-medium">
                    <Badge variant={selectedStudent.borrowedCount > 0 ? "secondary" : "outline"}>
                      {selectedStudent.borrowedCount}권
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteStudent(selectedStudent.id)}
                  data-testid="button-delete-student"
                >
                  <Trash2 size={16} className="mr-1" />
                  삭제
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleEditStudent(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  data-testid="button-edit-student"
                >
                  <Edit size={16} className="mr-1" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                  data-testid="button-close-student-detail"
                >
                  닫기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowEditDialog(false);
          setEditingStudent(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학생 정보 수정</DialogTitle>
            <DialogDescription>학생 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">이름 *</Label>
                    <Input
                      id="edit-name"
                      placeholder="학생 이름"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      data-testid="input-edit-student-name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-grade">학년 *</Label>
                      <Input
                        id="edit-grade"
                        type="number"
                        min="1"
                        max="6"
                        placeholder="학년"
                        value={editFormData.grade}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, grade: e.target.value })
                        }
                        data-testid="input-edit-student-grade"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-class">반 *</Label>
                      <Input
                        id="edit-class"
                        type="number"
                        min="1"
                        placeholder="반"
                        value={editFormData.class}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, class: e.target.value })
                        }
                        data-testid="input-edit-student-class"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-number">번호 *</Label>
                      <Input
                        id="edit-number"
                        type="number"
                        min="1"
                        placeholder="번호"
                        value={editFormData.number}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, number: e.target.value })
                        }
                        data-testid="input-edit-student-number"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditDialog(false);
                        setEditingStudent(null);
                      }}
                      data-testid="button-cancel-edit-student"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateStudentMutation.isPending}
                      data-testid="button-submit-edit-student"
                    >
                      {updateStudentMutation.isPending ? "수정 중..." : "수정"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
