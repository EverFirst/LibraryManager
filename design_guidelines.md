# Elementary School Library Management System - Design Guidelines

## Design Approach

**Selected System:** Material Design with Elementary School Customization
**Rationale:** Material Design provides clear, functional patterns ideal for data management while allowing for friendly customization suitable for an elementary school environment.

**Core Principles:**
- **Clarity First:** Clean information hierarchy for efficient library operations
- **Friendly Accessibility:** Large touch targets and readable text for all ages
- **Organized Efficiency:** Structured layouts that make tasks quick and intuitive
- **Approachable Professionalism:** Warm, welcoming aesthetic without sacrificing functionality

## Typography

**Font Family:**
- Primary: 'Nunito' (Google Fonts) - rounded, friendly yet professional
- Weights: 400 (regular), 600 (semibold), 700 (bold)

**Type Scale:**
- Page Titles: text-3xl font-bold (30px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-semibold (18px)
- Body Text: text-base (16px)
- Labels/Metadata: text-sm (14px)
- Buttons: text-base font-semibold

## Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-6 to p-8
- Card gaps: gap-6
- Section margins: mb-8 to mb-12
- Form field spacing: space-y-4

**Container Widths:**
- Main content: max-w-7xl mx-auto px-6
- Forms/Cards: Standard container within max-w-7xl
- Modals: max-w-2xl

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Book listing: grid-cols-1 lg:grid-cols-2 gap-4
- Student roster: Single column with table/card layout

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with library name/logo left, user profile/logout right
- Main navigation tabs below header: Dashboard, Books, Students, Borrowing, History
- Height: h-16 for header, h-12 for tabs
- Active tab indicator with bottom border (border-b-2)

### Dashboard Components
**Statistics Cards (3-column grid):**
- Total Books, Books Borrowed, Overdue Books
- Large number display (text-4xl font-bold) with label below
- Icon in top-right corner (48px size)
- Padding: p-8, rounded-xl, shadow-sm

**Recent Activity List:**
- Card-based timeline showing latest 10 transactions
- Each item: Student name, book title, action, timestamp
- Alternating subtle background for readability

**Overdue Alerts Panel:**
- Prominent placement on dashboard
- List format with student name, book title, days overdue
- Border-left accent (border-l-4) for visual emphasis

### Book Management
**Book Cards (Grid View):**
- Cover image placeholder area (aspect-ratio-[2/3], h-48)
- Title (text-lg font-semibold, 2-line clamp)
- Author (text-sm)
- Status badge (Available/Borrowed)
- Action button at bottom
- Padding: p-4, rounded-lg, shadow hover:shadow-md transition

**Book List (Table View):**
- Table headers: Title, Author, ISBN, Category, Status, Actions
- Row height: h-16 for comfortable scanning
- Alternating row backgrounds for readability
- Quick action buttons in Actions column

**Add/Edit Book Form:**
- Two-column layout for desktop (grid-cols-2 gap-6)
- Fields: Title, Author, ISBN, Publisher, Category, Publication Year, Quantity
- Full-width textarea for Description
- Buttons: Submit (primary), Cancel (secondary)

### Student Management
**Student Cards:**
- Avatar placeholder (w-16 h-16 rounded-full)
- Name, Grade-Class-Number format
- Currently borrowed count badge
- View Details button
- Padding: p-6, rounded-lg

**Student Profile View:**
- Header section: Avatar, name, student details, current borrowed books count
- Tabs: Current Books, Borrowing History
- Current Books: List of borrowed books with due dates
- History: Paginated table of past borrowing records

### Borrowing/Return Interface
**Borrowing Form:**
- Step 1: Search and select student (autocomplete input with dropdown)
- Step 2: Search and select book (filtered to available books only)
- Step 3: Confirm details and process
- Due date auto-calculated and displayed (14 days from today)
- Visual confirmation after successful transaction

**Return Form:**
- Search student or scan student ID
- Display currently borrowed books as selectable cards
- Select book(s) to return
- Return date auto-recorded
- Success confirmation with option to print receipt

### Forms & Inputs
**Input Fields:**
- Label above input (text-sm font-medium mb-2)
- Input height: h-12
- Rounded: rounded-lg
- Border: focus:ring-2 focus:ring-offset-2
- Placeholder text in lighter shade

**Buttons:**
- Primary: px-6 py-3, rounded-lg, font-semibold
- Secondary: px-6 py-3, rounded-lg, border-2
- Icon buttons: p-3, rounded-lg
- Minimum touch target: 44x44px

**Search Bars:**
- Height: h-12
- Icon left (search icon from Heroicons)
- Rounded-full for friendly appearance
- Width: full or w-96 depending on context

### Data Display
**Tables:**
- Header row: font-semibold, border-b-2
- Cell padding: px-6 py-4
- Striped rows for readability
- Hover state on rows
- Action column with icon buttons (Edit, Delete, View)

**Status Badges:**
- Available: Rounded-full, px-3 py-1, text-sm font-medium
- Borrowed: Same styling, different semantic color
- Overdue: Same styling with alert semantic color
- Badge positioning: inline with text or absolute top-right in cards

### Modals/Dialogs
**Confirmation Dialogs:**
- max-w-md, centered
- Icon at top (warning/info/success)
- Title (text-xl font-bold)
- Description text
- Two-button layout: Cancel (secondary), Confirm (primary)
- Backdrop overlay with slight blur

**Detail Views:**
- Slide-in panel from right (max-w-2xl)
- Close button top-right
- Scrollable content area
- Action buttons fixed at bottom

## Icons
**Icon Library:** Heroicons (via CDN)
**Usage:**
- Navigation: outline style, 24px
- Cards/buttons: outline style, 20px
- Tables/inline: outline style, 16px
- Status indicators: solid style, 16px

## Animations
**Minimal, Purposeful Animations:**
- Card hover: subtle shadow increase (hover:shadow-lg transition-shadow duration-200)
- Button interactions: built-in states only
- Modal entry: fade-in only
- NO scroll animations, parallax, or decorative motion

## Images
**No Hero Section Required** - This is an internal management tool, not a marketing page.

**Book Cover Placeholders:**
- Aspect ratio 2:3 (standard book cover)
- Placeholder shows book icon when no cover available
- Upload functionality for custom covers
- Display in book cards and detail views

**Student Avatar Placeholders:**
- Circular avatars (rounded-full)
- Size: 64px in cards, 96px in profile views
- Placeholder shows initial letter when no photo

## Accessibility
- All form inputs have associated labels
- Buttons have clear text or aria-labels
- Keyboard navigation for all interactive elements
- Focus indicators on all focusable elements (focus:ring-2)
- Sufficient color contrast for text (evaluated after color selection)
- Touch targets minimum 44x44px

## Responsive Behavior
- **Mobile (< 768px):** Single column layouts, full-width components, stacked forms
- **Tablet (768px - 1024px):** 2-column grids, side-by-side forms
- **Desktop (> 1024px):** Full multi-column layouts, optimized table views