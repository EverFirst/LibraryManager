import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-login-title">
            도서관 관리 시스템
          </h1>
          <p className="text-muted-foreground" data-testid="text-login-subtitle">
            초등학교 도서관을 위한 관리 시스템
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={handleLogin}
            className="w-full"
            size="lg"
            data-testid="button-login"
          >
            로그인
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Google, GitHub, Apple 또는 이메일로 로그인하세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
