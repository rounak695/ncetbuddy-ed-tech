# NCET Buddy 📚

A comprehensive web platform for NCET (National Common Entrance Test) exam preparation, built with modern web technologies. This platform provides mock tests, study materials, video classes, and progress tracking for students preparing for the NCET exam.

## 🌟 Features

### For Students
- **🎯 Mock Test Engine**: Custom-built test engine with:
  - Real-time countdown timer
  - Question palette for easy navigation
  - Smart scoring system (+4 for correct, -1 for incorrect)
  - Answer tracking and progress monitoring
  - Automatic submission on timer expiry
  
- **📖 Study Materials**:
  - Books & Notes library with Google Drive integration
  - Formula Cards for quick reference
  - Previous Year Questions (PYQs) database
  - Subject-wise organization
  
- **🎥 Video Classes**: YouTube integrated video library with organized content

- **📊 Progress Tracking**:
  - Personal analytics dashboard
  - Test results history
  - Leaderboard rankings
  - Score tracking across all tests

- **🔔 Notifications**: Stay updated with announcements and important updates

### For Admins
- **👥 User Management**: View and manage student accounts, ban/unban users
- **📝 Content Management**:
  - Create and edit mock tests with custom questions
  - Upload books and notes
  - Manage formula cards
  - Add PYQs
  - Upload video classes
- **📢 Notifications**: Send platform-wide announcements
- **⚙️ Settings**: Configure site-wide settings
- **📈 Analytics**: View platform statistics and user engagement

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Font**: Inter (Google Fonts)

### Backend
- **BaaS**: Appwrite (Cloud/Self-hosted)
  - Database (NoSQL)
  - Authentication
  - Storage
  - Permissions & Security

### Hosting & Deployment
- **Hosting**: Firebase Hosting
- **Build**: Next.js static export

### Integrations
- **Video**: YouTube XML Feed API

## 📋 Prerequisites

- Node.js 20+ and npm
- Appwrite account (Cloud or self-hosted instance)
- Firebase account (for hosting)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rounak695/ncetbuddy-ed-tech.git
cd ncetbuddy-ed-tech-2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=ncet-buddy-db

# Admin API Key (for setup scripts only)
APPWRITE_API_KEY=your_api_key_here
```

**How to get these values:**
1. Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Copy the Project ID from your project dashboard
3. Generate an API Key with appropriate scopes for database setup

### 4. Set Up Database

Run the database setup script to create collections and attributes:

```bash
node scripts/setup-schema.js
```

This will create 8 collections:
- `users` - User profiles and roles
- `tests` - Mock test definitions
- `test-results` - User test submissions
- `books` - Study materials and notes
- `formula_cards` - Quick reference formulas
- `pyqs` - Previous year questions
- `notifications` - Platform announcements
- `settings` - Site configuration
- `videos` - Video class library

### 5. Configure Permissions (Optional)

Run the permissions script to set up role-based access:

```bash
node scripts/fix-permissions.js
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
ncetbuddy-ed-tech-2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── dashboard/         # Student dashboard pages
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   ├── setup/             # First-time admin setup
│   │   ├── privacy/           # Legal pages
│   │   ├── terms/
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── landing/           # Landing page sections
│   │   ├── layouts/           # Layout components
│   │   ├── test/              # Test engine components
│   │   └── ui/                # Reusable UI components
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/
│   │   ├── appwrite.ts        # Appwrite client setup
│   │   ├── appwrite-db.ts     # Database operations
│   │   └── youtube.ts         # YouTube integration
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── scripts/
│   ├── setup-schema.js        # Database schema setup
│   └── fix-permissions.js     # Permissions configuration
├── public/
│   ├── logo.png               # Application logo
│   └── favicon.ico
├── firebase.json              # Firebase hosting config
├── .firebaserc               # Firebase project config
└── package.json
```

## 🗄️ Database Schema

### Collections

#### `users`
- `userId` (string) - Appwrite user ID
- `email` (string) - User email
- `displayName` (string) - User's display name
- `role` (string) - 'user' or 'admin'
- `premiumStatus` (boolean) - Premium membership status
- `isBanned` (boolean) - Account ban status
- `totalScore` (integer) - Cumulative test scores
- `testsAttempted` (integer) - Number of tests completed
- `createdAt` (integer) - Timestamp

#### `tests`
- `title` (string) - Test name
- `subject` (string) - Subject category
- `duration` (integer) - Test duration in minutes
- `questions` (string) - JSON array of questions
- `isVisible` (boolean) - Visibility status
- `createdBy` (string) - Creator user ID
- `createdAt` (integer) - Timestamp

#### `test-results`
- `userId` (string) - User ID
- `testId` (string) - Test ID
- `score` (integer) - Test score
- `totalQuestions` (integer) - Total questions
- `answers` (string) - JSON object of answers
- `completedAt` (integer) - Completion timestamp

#### `books`
- `title` (string) - Book/Note title
- `subject` (string) - Subject
- `chapter` (string) - Chapter name
- `url` (string) - Google Drive or external URL
- `thumbnailColor` (string) - Display color
- `isVisible` (boolean) - Visibility status
- `createdAt` (integer) - Timestamp

#### `formula_cards`
- `title` (string) - Formula title
- `subject` (string) - Subject
- `chapter` (string) - Chapter
- `content` (string) - Text content
- `imageUrl` (string) - Formula image URL
- `isVisible` (boolean) - Visibility status
- `createdAt` (integer) - Timestamp

#### `pyqs`
- `title` (string) - PYQ title
- `subject` (string) - Subject
- `year` (integer) - Exam year
- `url` (string) - PDF URL
- `createdAt` (integer) - Timestamp

#### `notifications`
- `title` (string) - Notification title
- `message` (string) - Notification content
- `type` (string) - 'info', 'alert', or 'success'
- `createdAt` (integer) - Timestamp

#### `settings`
- `siteName` (string) - Site name
- `contactEmail` (string) - Contact email
- `allowSignup` (boolean) - Signup enabled
- `maintenanceMode` (boolean) - Maintenance mode

#### `videos`
- `title` (string) - Video title
- `description` (string) - Video description
- `url` (string) - YouTube URL
- `subject` (string) - Subject category
- `thumbnailUrl` (string) - Thumbnail URL
- `createdAt` (integer) - Timestamp

## 🔐 Authentication & Roles

The platform uses Appwrite Authentication with role-based access control:

- **User Role**: Access to dashboard, tests, study materials, and personal analytics
- **Admin Role**: Full access to admin panel, content management, and user management

### First Admin Setup
1. Sign up for an account
2. Visit `/setup` route
3. Use the admin setup key to grant admin access

## 🎨 Customization

### Color Scheme
Primary colors are defined in `src/app/globals.css`:
- Primary: `#FFD02F` (Yellow)
- Background: `#FFFFFF` (White)
- Foreground: `#000000` (Black)
- Success: `#10B981` (Green)
- Error: `#EF4444` (Red)

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase

```bash
firebase deploy
```

The app is configured for static export to Firebase Hosting.

## 🧪 Test Engine Features

The custom test engine includes:
- ⏱️ **Timer**: Auto-submission when time expires
- 🎨 **Question Palette**: Visual navigation with status indicators
  - Answered (green)
  - Visited (yellow)
  - Not Visited (gray)
- ✅ **Scoring**: +4 for correct, -1 for incorrect (NCET pattern)
- 💾 **Auto-save**: State preservation during navigation
- 📊 **Instant Results**: Score calculation and result display

## 👨‍💻 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

This is a private educational project. For collaborators:
1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support or queries, please contact the development team.

---

**Built with ❤️ for NCET aspirants**
