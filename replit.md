# Elementary School Library Management System

## Overview

An elementary school library management system built with React, Express, and PostgreSQL. The application allows librarians to manage books, students, and borrowing records with a friendly, accessible interface designed for educational environments. Features include book cataloging, student registration, borrowing/returning workflows, overdue tracking, and activity monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**Routing**: Wouter for client-side routing with the following pages:
- Dashboard (stats, recent activity, overdue alerts)
- Books (CRUD operations with grid/table views)
- Students (CRUD operations)
- Borrow/Return (multi-step workflow)
- History (borrowing records)

**UI Component Library**: shadcn/ui components built on Radix UI primitives
- Design system follows Material Design principles adapted for elementary school use
- Custom typography using Nunito font family for friendly appearance
- Tailwind CSS for styling with custom theme extending neutral color palette
- Component examples included for development reference

**State Management**:
- TanStack Query (React Query) for server state management
- No global client state library (local state with hooks)
- Query invalidation strategy for cache synchronization

**Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Development Mode**: Vite dev server with HMR middleware integration

**Production Mode**: Pre-built static assets served from Express

**API Design**: RESTful endpoints with the following structure:
- `/api/stats` - Dashboard statistics
- `/api/books` - Book CRUD operations with search
- `/api/students` - Student CRUD operations with search
- `/api/borrow-records` - Borrowing/returning operations
- `/api/recent-activities` - Activity feed
- `/api/overdue-items` - Overdue tracking

**Error Handling**: Centralized error handling with JSON responses and appropriate HTTP status codes

**Request Logging**: Custom middleware logging request duration and paths for API endpoints

### Database Layer

**ORM**: Drizzle ORM for type-safe database queries

**Database Dialect**: PostgreSQL (configured for Neon serverless)

**Schema Design**:
- `users` - User authentication (username/password)
- `books` - Book catalog (title, author, ISBN, category, quantity, availability)
- `students` - Student records (name, grade, class, number)
- `borrow_records` - Borrowing history (student-book relationships, dates)

**Schema Validation**: Drizzle-Zod integration for runtime validation matching database schema

**Migration Strategy**: Drizzle Kit for schema migrations with push command

**Connection Handling**: Connection pooling via @neondatabase/serverless with WebSocket support

### External Dependencies

**Database Service**: 
- Neon PostgreSQL (serverless PostgreSQL with connection pooling)
- WebSocket connections for serverless compatibility
- Environment variable `DATABASE_URL` required

**UI Component Dependencies**:
- Radix UI primitives for accessible components
- Lucide React for icons
- date-fns for date manipulation and formatting (Korean locale support)
- class-variance-authority for component variant management

**Development Tools**:
- Replit-specific plugins for development environment integration
- TypeScript for type safety across full stack
- ESBuild for production builds

**Build Configuration**:
- Vite for frontend bundling and dev server
- Path aliases configured (@/, @shared/, @assets/)
- Separate client and server TypeScript compilation