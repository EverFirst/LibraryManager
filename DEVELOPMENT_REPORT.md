# 초등학교 도서관 관리 시스템 개발 리포트

## 1. 프로젝트 개요

### 1.1 프로젝트 목적
초등학교 도서관에서 도서 대여/반납 업무를 효율적으로 관리하기 위한 웹 기반 시스템입니다. 사서 선생님이 도서와 학생을 관리하고, 대여/반납 이력을 추적하며, 연체 현황을 모니터링할 수 있습니다.

### 1.2 주요 기능
- **대시보드**: 전체 도서 현황, 대여 중인 도서, 연체 도서 통계 및 최근 활동 모니터링
- **도서 관리**: 도서 등록, 수정, 삭제, 검색 (표지 이미지 URL 지원)
- **학생 관리**: 학생 등록, 수정, 삭제, 검색 (학년/반/번호 체계)
- **대여/반납**: 학생별 도서 대여 및 반납 처리 (14일 대여 기간)
- **대여 이력**: 전체 대여/반납 기록 조회
- **인증**: Replit Auth를 통한 OAuth 로그인 (Google, GitHub, Apple, 이메일)

### 1.3 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | React 18, TypeScript, Vite, Tailwind CSS |
| **UI 컴포넌트** | shadcn/ui (Radix UI 기반) |
| **상태 관리** | TanStack Query (React Query) |
| **라우팅** | Wouter |
| **백엔드** | Express.js, TypeScript |
| **데이터베이스** | PostgreSQL (Neon Serverless) |
| **ORM** | Drizzle ORM |
| **인증** | Replit Auth (OpenID Connect) |
| **폰트** | Nunito (한글 친화적) |

---

## 2. 시스템 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                      클라이언트 (브라우저)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React + TypeScript + Vite              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ 대시보드  │ │ 도서관리  │ │ 학생관리  │ ...        │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  │           ↓ TanStack Query (API 호출)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      서버 (Express.js)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   RESTful API                        │   │
│  │  /api/books  /api/students  /api/borrow-records     │   │
│  │  /api/stats  /api/auth/user  /api/login             │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Storage Layer (Drizzle ORM)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ WebSocket (Neon)
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL (Neon Serverless)                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────┐  │
│  │  users   │ │  books   │ │borrow_records │ │ students │  │
│  └──────────┘ └──────────┘ └───────────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 디렉토리 구조

```
project/
├── client/                    # 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 컴포넌트
│   │   │   ├── ui/           # shadcn/ui 컴포넌트
│   │   │   ├── BookCard.tsx
│   │   │   ├── StudentCard.tsx
│   │   │   ├── AddBookForm.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ...
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Books.tsx
│   │   │   ├── Students.tsx
│   │   │   ├── Borrow.tsx
│   │   │   ├── History.tsx
│   │   │   └── Login.tsx
│   │   ├── hooks/            # 커스텀 훅
│   │   │   ├── useAuth.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/              # 유틸리티
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx           # 앱 진입점
│   │   └── index.css         # 전역 스타일
│   └── index.html
├── server/                    # 백엔드
│   ├── app.ts                # Express 앱 설정
│   ├── routes.ts             # API 라우트
│   ├── storage.ts            # 데이터베이스 작업
│   └── replitAuth.ts         # 인증 설정
├── shared/                    # 공유 코드
│   └── schema.ts             # 데이터베이스 스키마 & 타입
└── package.json
```

---

## 3. 데이터베이스 설계

### 3.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │     books       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ email           │       │ title           │
│ firstName       │       │ author          │
│ lastName        │       │ isbn            │
│ profileImageUrl │       │ publisher       │
│ createdAt       │       │ category        │
│ updatedAt       │       │ publicationYear │
└─────────────────┘       │ quantity        │
                          │ available       │
                          │ description     │
                          │ imageUrl        │
                          │ createdAt       │
                          └────────┬────────┘
                                   │
                                   │ 1:N
                                   ▼
┌─────────────────┐       ┌─────────────────┐
│    students     │       │ borrow_records  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ id (PK)         │
│ name            │  1:N  │ studentId (FK)  │
│ grade           │       │ bookId (FK)     │──────┘
│ class           │       │ borrowDate      │
│ number          │       │ dueDate         │
│ createdAt       │       │ returnDate      │
└─────────────────┘       │ status          │
                          │ createdAt       │
                          └─────────────────┘
```

### 3.2 테이블 상세

#### users (사용자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | VARCHAR (PK) | OAuth 제공자의 사용자 ID |
| email | VARCHAR (UNIQUE) | 이메일 주소 |
| firstName | VARCHAR | 이름 |
| lastName | VARCHAR | 성 |
| profileImageUrl | VARCHAR | 프로필 이미지 URL |
| createdAt | TIMESTAMP | 생성일시 |
| updatedAt | TIMESTAMP | 수정일시 |

#### books (도서)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | VARCHAR (PK) | UUID 자동 생성 |
| title | TEXT | 도서명 (필수) |
| author | TEXT | 저자 (필수) |
| isbn | TEXT | ISBN 번호 |
| publisher | TEXT | 출판사 |
| category | TEXT | 분류 (필수) |
| publicationYear | INTEGER | 출판년도 |
| quantity | INTEGER | 총 수량 (기본값: 1) |
| available | INTEGER | 대여 가능 수량 |
| description | TEXT | 도서 설명 |
| imageUrl | TEXT | 표지 이미지 URL |
| createdAt | TIMESTAMP | 등록일시 |

#### students (학생)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | VARCHAR (PK) | UUID 자동 생성 |
| name | TEXT | 학생 이름 (필수) |
| grade | INTEGER | 학년 (1-6) |
| class | INTEGER | 반 |
| number | INTEGER | 번호 |
| createdAt | TIMESTAMP | 등록일시 |

#### borrow_records (대여 기록)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | VARCHAR (PK) | UUID 자동 생성 |
| studentId | VARCHAR (FK) | 학생 ID |
| bookId | VARCHAR (FK) | 도서 ID |
| borrowDate | TIMESTAMP | 대여일 (자동) |
| dueDate | TIMESTAMP | 반납 예정일 |
| returnDate | TIMESTAMP | 실제 반납일 (NULL = 미반납) |
| status | TEXT | 상태 (borrowed/returned) |
| createdAt | TIMESTAMP | 생성일시 |

### 3.3 스키마 정의 (Drizzle ORM)

```typescript
// shared/schema.ts
export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn"),
  publisher: text("publisher"),
  category: text("category").notNull(),
  publicationYear: integer("publication_year"),
  quantity: integer("quantity").notNull().default(1),
  available: integer("available").notNull().default(1),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  grade: integer("grade").notNull(),
  class: integer("class").notNull(),
  number: integer("number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const borrowRecords = pgTable("borrow_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  bookId: varchar("book_id").notNull().references(() => books.id),
  borrowDate: timestamp("borrow_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: text("status").notNull().default("borrowed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 4. API 설계

### 4.1 인증 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/login | OAuth 로그인 시작 |
| GET | /api/callback | OAuth 콜백 처리 |
| GET | /api/logout | 로그아웃 |
| GET | /api/auth/user | 현재 로그인한 사용자 정보 |

### 4.2 대시보드 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/stats | 통계 정보 (총 도서, 대여 중, 연체) |
| GET | /api/recent-activities | 최근 활동 목록 (최대 10개) |
| GET | /api/overdue-items | 연체 도서 목록 |

### 4.3 도서 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/books | 전체 도서 목록 |
| GET | /api/books?search=검색어 | 도서 검색 |
| GET | /api/books/:id | 특정 도서 조회 |
| POST | /api/books | 도서 등록 |
| PUT | /api/books/:id | 도서 수정 |
| DELETE | /api/books/:id | 도서 삭제 |

### 4.4 학생 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/students | 전체 학생 목록 |
| GET | /api/students?search=검색어 | 학생 검색 |
| GET | /api/students/:id | 특정 학생 조회 |
| POST | /api/students | 학생 등록 |
| PUT | /api/students/:id | 학생 수정 |
| DELETE | /api/students/:id | 학생 삭제 |

### 4.5 대여 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/borrow-records | 전체 대여 기록 |
| GET | /api/borrow-records?active=true | 현재 대여 중인 기록 |
| GET | /api/borrow-records?studentId=xxx | 특정 학생의 대여 기록 |
| GET | /api/borrow-records?bookId=xxx | 특정 도서의 대여 기록 |
| POST | /api/borrow-records | 도서 대여 |
| POST | /api/borrow-records/:id/return | 도서 반납 |

### 4.6 API 응답 예시

#### 도서 목록 조회 응답
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "해리포터와 마법사의 돌",
    "author": "J.K. 롤링",
    "isbn": "9788983920683",
    "publisher": "문학수첩",
    "category": "판타지",
    "publicationYear": 2019,
    "quantity": 3,
    "available": 2,
    "description": "해리포터 시리즈 1권",
    "imageUrl": "https://example.com/harry-potter.jpg",
    "createdAt": "2024-01-15T09:00:00.000Z"
  }
]
```

#### 대시보드 통계 응답
```json
{
  "totalBooks": 150,
  "borrowedBooks": 23,
  "overdueBooks": 5
}
```

---

## 5. 프론트엔드 설계

### 5.1 라우팅 구조

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| / | Dashboard | 대시보드 (통계, 최근 활동, 연체 알림) |
| /books | Books | 도서 관리 |
| /students | Students | 학생 관리 |
| /borrow | Borrow | 대여/반납 처리 |
| /history | History | 대여 이력 조회 |

### 5.2 주요 컴포넌트

#### Navigation (네비게이션)
- 상단 헤더에 고정
- 현재 로그인한 사용자 표시
- 로그아웃 버튼
- 5개 메뉴 탭 (대시보드, 도서 관리, 학생 관리, 대여/반납, 대여 이력)

#### DashboardStats (대시보드 통계)
- 3개의 통계 카드 표시
- 전체 도서 수, 대여 중인 도서, 연체 도서

#### BookCard (도서 카드)
- 도서 정보 표시 (표지, 제목, 저자, 분류)
- 대여 가능 수량 표시
- 상세보기 버튼

#### StudentCard (학생 카드)
- 학생 정보 표시 (이름, 학년/반/번호)
- 현재 대여 중인 도서 수
- 상세보기 버튼

#### AddBookForm (도서 등록/수정 폼)
- 도서 정보 입력 필드
- Zod 스키마 기반 유효성 검사
- 생성 및 수정 모드 지원

### 5.3 상태 관리

TanStack Query를 사용하여 서버 상태를 관리합니다:

```typescript
// 도서 목록 조회
const { data: books, isLoading } = useQuery<Book[]>({
  queryKey: ["/api/books", searchQuery],
  queryFn: async () => {
    const url = searchQuery
      ? `/api/books?search=${encodeURIComponent(searchQuery)}`
      : "/api/books";
    const response = await fetch(url);
    return response.json();
  },
});

// 도서 생성 뮤테이션
const createBookMutation = useMutation({
  mutationFn: (data: InsertBook) => apiRequest("POST", "/api/books", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/books"] });
    toast({ title: "도서가 추가되었습니다" });
  },
});
```

### 5.4 UI/UX 디자인 원칙

- **Material Design** 기반의 깔끔한 인터페이스
- **Nunito 폰트** 사용으로 친근한 느낌
- **파란색 계열** 메인 컬러 (도서관 이미지)
- **카드 기반 레이아웃**으로 정보 구분
- **반응형 디자인**으로 다양한 화면 크기 지원
- **한국어 인터페이스** 전체 적용

---

## 6. 인증 시스템

### 6.1 Replit Auth (OpenID Connect)

Replit의 OAuth 서비스를 사용하여 다양한 로그인 방법을 지원합니다:
- Google 계정
- GitHub 계정
- Apple 계정
- 이메일/비밀번호

### 6.2 인증 흐름

```
1. 사용자가 "로그인" 버튼 클릭
   ↓
2. /api/login으로 리다이렉트
   ↓
3. Replit OIDC 서버로 리다이렉트
   ↓
4. 사용자가 로그인 방법 선택 및 인증
   ↓
5. /api/callback으로 리다이렉트
   ↓
6. 사용자 정보 저장/업데이트 (upsertUser)
   ↓
7. 세션 생성 및 메인 페이지로 리다이렉트
```

### 6.3 세션 관리

```typescript
// server/replitAuth.ts
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1주일
  const pgStore = connectPg(session);
  return session({
    secret: process.env.SESSION_SECRET!,
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      tableName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}
```

### 6.4 클라이언트 인증 훅

```typescript
// client/src/hooks/useAuth.ts
export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });

  return { user: user ?? null, isLoading, error };
}
```

---

## 7. 핵심 비즈니스 로직

### 7.1 도서 대여 처리

```typescript
async createBorrowRecord(record: InsertBorrowRecord): Promise<BorrowRecord> {
  // 1. 도서 대여 가능 여부 확인
  const book = await this.getBook(record.bookId);
  if (!book || book.available <= 0) {
    throw new Error("Book not available");
  }

  // 2. 대여 기록 생성
  const [newRecord] = await db
    .insert(schema.borrowRecords)
    .values(record)
    .returning();

  // 3. 도서 가용 수량 감소
  await db
    .update(schema.books)
    .set({ available: sql`${schema.books.available} - 1` })
    .where(eq(schema.books.id, record.bookId));

  return newRecord;
}
```

### 7.2 도서 반납 처리

```typescript
async returnBook(recordId: string): Promise<BorrowRecord> {
  const record = await this.getBorrowRecord(recordId);
  if (!record || record.status === "returned") {
    throw new Error("Invalid borrow record");
  }

  // 1. 대여 기록 업데이트
  const [updatedRecord] = await db
    .update(schema.borrowRecords)
    .set({
      returnDate: new Date(),
      status: "returned",
    })
    .where(eq(schema.borrowRecords.id, recordId))
    .returning();

  // 2. 도서 가용 수량 증가
  await db
    .update(schema.books)
    .set({ available: sql`${schema.books.available} + 1` })
    .where(eq(schema.books.id, record.bookId));

  return updatedRecord;
}
```

### 7.3 연체 판정 로직

```typescript
async getOverdueItems(): Promise<OverdueItem[]> {
  return await db
    .select()
    .from(schema.borrowRecords)
    .where(
      and(
        eq(schema.borrowRecords.status, "borrowed"),  // 미반납
        sql`${schema.borrowRecords.dueDate} < NOW()`  // 반납 예정일 경과
      )
    )
    .orderBy(schema.borrowRecords.dueDate);
}
```

---

## 8. 보안 고려사항

### 8.1 현재 구현된 보안 기능

| 항목 | 구현 상태 | 설명 |
|------|-----------|------|
| HTTPS | O | Replit 자동 제공 |
| 세션 보안 | O | httpOnly, secure 쿠키 |
| OAuth 인증 | O | Replit Auth 사용 |
| SQL Injection 방지 | O | Drizzle ORM 파라미터화 쿼리 |
| XSS 방지 | O | React 자동 이스케이프 |

### 8.2 추가 권장 보안 기능 (향후 구현)

| 항목 | 설명 |
|------|------|
| 접근 제어 | 특정 이메일 도메인만 허용 |
| 관리자 승인 | 신규 사용자 승인 프로세스 |
| API Rate Limiting | 과도한 요청 제한 |
| 감사 로그 | 주요 작업 기록 |

---

## 9. 개발 환경 설정

### 9.1 환경 변수

| 변수명 | 설명 |
|--------|------|
| DATABASE_URL | PostgreSQL 연결 문자열 |
| SESSION_SECRET | 세션 암호화 키 |
| REPL_ID | Replit 프로젝트 ID (자동) |
| ISSUER_URL | OIDC 발급자 URL (자동) |

### 9.2 개발 서버 실행

```bash
npm run dev
```

### 9.3 데이터베이스 마이그레이션

```bash
npm run db:push
```

---

## 10. 배포

### 10.1 배포 환경

- **플랫폼**: Replit
- **데이터베이스**: Neon PostgreSQL (서버리스)
- **도메인**: Replit 제공 (.replit.app)

### 10.2 배포 프로세스

1. Replit에서 "Deploy" 버튼 클릭
2. 자동으로 빌드 및 배포 수행
3. 프로덕션 URL 생성

---

## 11. 향후 개선 사항

### 11.1 기능 개선

| 우선순위 | 기능 | 설명 |
|----------|------|------|
| 높음 | 접근 제어 | 관리자 승인 기반 사용자 관리 |
| 높음 | 바코드 스캔 | 도서 ISBN 바코드 스캔 지원 |
| 중간 | 통계 리포트 | 월별/분기별 대여 통계 |
| 중간 | 알림 기능 | 연체 도서 이메일/SMS 알림 |
| 낮음 | 도서 추천 | 학년별 추천 도서 기능 |
| 낮음 | 다크 모드 | UI 테마 전환 |

### 11.2 기술 개선

| 항목 | 설명 |
|------|------|
| 캐싱 | Redis 기반 API 캐싱 |
| 테스트 | 단위 테스트 및 E2E 테스트 추가 |
| 모니터링 | 에러 트래킹 및 성능 모니터링 |
| PWA | 오프라인 지원 및 앱 설치 |

---

## 12. 결론

본 시스템은 초등학교 도서관의 기본적인 업무를 지원하는 MVP(Minimum Viable Product) 수준으로 개발되었습니다. 

**주요 성과:**
- 도서/학생 CRUD 기능 완성
- 대여/반납 워크플로우 구현
- 연체 도서 추적 기능
- OAuth 기반 인증 시스템
- 한국어 인터페이스

**기술적 특징:**
- 타입 안전성 (TypeScript 전역 적용)
- 현대적인 React 패턴 (함수형 컴포넌트, 훅)
- 서버리스 아키텍처 (Neon PostgreSQL)
- 반응형 UI (Tailwind CSS)

향후 사용자 피드백을 반영하여 접근 제어, 통계 기능 등을 추가 개발할 예정입니다.

---

*작성일: 2024년*
*버전: 1.0 (MVP)*
