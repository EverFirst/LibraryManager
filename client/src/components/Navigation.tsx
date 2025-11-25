import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  History,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/", label: "대시보드", icon: LayoutDashboard },
  { path: "/books", label: "도서 관리", icon: BookOpen },
  { path: "/students", label: "학생 관리", icon: Users },
  { path: "/borrow", label: "대여/반납", icon: ArrowLeftRight },
  { path: "/history", label: "대여 이력", icon: History },
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary" size={28} />
            <h1 className="text-xl font-bold">도서관 관리 시스템</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Logout clicked")}
            data-testid="button-logout"
          >
            <LogOut size={18} />
            <span className="ml-2">로그아웃</span>
          </Button>
        </div>
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`rounded-none border-b-2 ${
                    isActive
                      ? "border-b-primary text-primary"
                      : "border-b-transparent"
                  }`}
                  data-testid={`nav-${item.label}`}
                >
                  <Icon size={18} />
                  <span className="ml-2">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
