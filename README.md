SkillSnap

<div align="center">
**AI-Powered Resume Analysis & Career Development Platform**

Transform your career journey with intelligent resume analysis, skill gap identification, and personalized learning roadmaps.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)](https://mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7.0-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.8-38B2AC)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue)](https://ai.google.dev/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

**IMPETUS (SkillSnap)** is a comprehensive career development platform that leverages AI to analyze resumes, identify skill gaps, and create personalized learning roadmaps. Built with Next.js 16 and Google's Gemini AI, it provides job seekers with actionable insights to bridge the gap between their current skills and their dream job requirements.

### How It Works

1. **Upload Resume** - Upload your resume in PDF, DOC, or DOCX format
2. **Select Target Role** - Choose your desired job role and experience level
3. **AI Analysis** - Gemini AI analyzes your resume against job requirements
4. **Get Insights** - Receive detailed match scores, skill gaps, and recommendations
5. **Track Progress** - Follow personalized learning roadmaps to close skill gaps

---

## ✨ Features

### 🔐 **Authentication & User Management**
- Email/password authentication with JWT
- Google OAuth integration via Firebase
- Secure profile management
- Profile picture upload to Cloudinary
- Persistent sessions

### 📄 **Resume Analysis**
- **Multi-format Support**: PDF, DOC, DOCX parsing
- **Drag-and-Drop Upload**: Intuitive file upload interface
- **Job Role Selection**: 10+ career categories
- **Experience Levels**: Intern, Junior, Mid-Level, Senior
- **Optional Job Description**: Enhanced matching with JD
- **Real-time Processing**: Instant AI-powered analysis

### 📊 **Intelligent Analytics Dashboard**
- **Match Percentage**: Visual score showing resume-job alignment
- **Skills Analysis**: 
  - Skills found in resume
  - Missing required skills
  - Nice-to-have skills
- **ATS Score**: Applicant Tracking System compatibility rating
- **Recommendations**: Actionable improvement suggestions
- **Historical Analysis**: Track resume iterations over time

### 🗺️ **Personalized Learning Roadmaps**
- AI-generated skill development paths
- Phase-based learning structure
- Curated course recommendations
- Progress tracking with checkpoints
- Bulk progress updates
- Timeline estimation

### 👤 **User Dashboard**
- Upload history
- Analysis overview
- Roadmap progress tracking
- Quick actions
- Profile management

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | App Router, Server Components, API Routes |
| React | 18.2.0 | UI Components |
| Tailwind CSS | 3.4.8 | Styling & Responsive Design |
| Framer Motion | 10.12.5 | Animations |
| Lucide React | 0.268.0 | Icons |

### **Backend & Services**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.0.10 | RESTful API endpoints |
| MongoDB | 8.0.3 | Database (Mongoose ODM) |
| Firebase Auth | 12.7.0 | Google OAuth |
| Firebase Admin | 13.6.0 | Server-side auth verification |
| Cloudinary | 2.8.0 | File storage & CDN |
| Google Gemini AI | 0.21.0 | Resume analysis & recommendations |

### **AI & Document Processing**
| Technology | Purpose |
|------------|---------|
| @google/generative-ai | Gemini AI integration |
| pdf-parse | PDF text extraction |
| mammoth | DOCX text extraction |
| natural | NLP for text processing |

### **Authentication & Security**
| Technology | Purpose |
|------------|---------|
| JWT | Token-based authentication |
| bcryptjs | Password hashing |
| Firebase Auth | OAuth & identity management |

---

## 📁 Project Structure

```
IMPETUS-Complete/
├── app/                          # Next.js 16 App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.js
│   │   │   ├── register/route.js
│   │   │   ├── google/route.js
│   │   │   ├── me/route.js
│   │   │   ├── profile/route.js
│   │   │   └── profile-picture/route.js
│   │   ├── resume/               # Resume processing
│   │   │   └── analyze/route.js
│   │   ├── resume-analysis/      # Analysis CRUD
│   │   │   ├── route.js
│   │   │   └── [analysisId]/route.js
│   │   └── roadmap/              # Learning roadmaps
│   │       ├── [analysisId]/route.js
│   │       └── progress/[analysisId]/
│   │           ├── route.js
│   │           └── bulk/route.js
│   ├── analysis/                 # Analysis results page
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Login page
│   ├── signup/                   # Registration page
│   ├── profile/                  # User profile page
│   ├── upload-resume/            # Resume upload page
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Landing page
├── components/                   # React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── HowItWorks.jsx
│   ├── DreamJobCTA.jsx
│   ├── DottedBackground.jsx
│   └── PieChart.jsx
├── contexts/                     # React contexts
│   └── AuthContext.jsx
├── lib/                          # Utility libraries
│   ├── api.js                    # API client
│   ├── auth.js                   # Auth helpers
│   ├── firebase.js               # Firebase config
│   ├── cloudinary.js             # Cloudinary service
│   ├── geminiService.js          # Gemini AI integration
│   ├── resumeParser.js           # Document parsing
│   └── models/                   # Mongoose models
│       ├── User.js
│       └── ResumeAnalysis.js
├── middleware/                   # API middleware
│   ├── auth.js                   # JWT verification
│   └── database.js               # MongoDB connection
├── public/                       # Static assets
├── styles/                       # Global styles
│   └── globals.css
├── .env.local                    # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
└── package.json                  # Dependencies
```

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17.0 or higher
- **npm** 9.0.0 or higher (or **yarn**/**pnpm**)
- **MongoDB** (local or Atlas cloud instance)
- **Git** (for version control)

### Required Accounts & API Keys

1. **MongoDB Atlas** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
2. **Firebase** - [Console](https://console.firebase.google.com/)
3. **Cloudinary** - [Sign up](https://cloudinary.com/users/register/free)
4. **Google AI Studio** - [Get Gemini API Key](https://makersuite.google.com/app/apikey)

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/impetus-skillsnap.git
cd impetus-skillsnap
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

---

## 🔑 Environment Setup

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual credentials:

```env
# ============================================
# API Configuration
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ============================================
# MongoDB Database
# ============================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/impetus?retryWrites=true&w=majority

# ============================================
# JWT Authentication
# ============================================
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_random_string
JWT_EXPIRES_IN=7d

# ============================================
# Cloudinary (File Storage)
# ============================================
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ============================================
# Gemini AI (Resume Analysis)
# ============================================
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
USE_MOCK_AI=false

# ============================================
# Firebase (Google OAuth)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# ============================================
# Optional
# ============================================
NODE_ENV=development
```

### 3. Setup Guide for Each Service

#### **MongoDB Atlas**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with password
3. Whitelist your IP (0.0.0.0/0 for development)
4. Get connection string and replace in `MONGODB_URI`

#### **Firebase (Google OAuth)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable **Google Sign-In** in Authentication → Sign-in method
4. Add your domain to authorized domains
5. Go to Project Settings → Your apps → Web app
6. Copy config values to environment variables

#### **Cloudinary (File Storage)**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Paste into environment variables

#### **Google AI Studio (Gemini)**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API Key
3. Copy to `GEMINI_API_KEY`

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 🌐 API Endpoints

### **Authentication**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with email/password | No |
| POST | `/api/auth/google` | Google OAuth login | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| POST | `/api/auth/profile-picture` | Upload profile picture | Yes |

### **Resume Analysis**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/resume/analyze` | Upload & analyze resume | Yes |
| GET | `/api/resume-analysis` | Get all user's analyses | Yes |
| GET | `/api/resume-analysis/[id]` | Get specific analysis | Yes |
| DELETE | `/api/resume-analysis/[id]` | Delete analysis | Yes |

### **Learning Roadmaps**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/roadmap/[analysisId]` | Get learning roadmap | Yes |
| PATCH | `/api/roadmap/progress/[analysisId]` | Update single skill progress | Yes |
| PATCH | `/api/roadmap/progress/[analysisId]/bulk` | Bulk update progress | Yes |

### **Request/Response Examples**

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673abc123def456",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

#### Analyze Resume
```bash
POST /api/resume/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "resume": <file>,
  "jobRole": "Full Stack Developer",
  "experienceLevel": "Mid-Level",
  "jobDescription": "Looking for full stack developer..."
}

# Response
{
  "success": true,
  "analysis": {
    "id": "674xyz789abc012",
    "matchPercentage": 78,
    "skillsFound": ["JavaScript", "React", "Node.js"],
    "skillsMissing": ["Docker", "Kubernetes"],
    "atsScore": 85,
    "recommendations": [...]
  }
}
```

---

## 🎨 Pages & Features

### **Landing Page** (`/`)
- Hero section with CTA
- How it works section
- Features showcase
- Call to action

### **Sign Up** (`/signup`)
- Email/password registration
- Google OAuth option
- Form validation
- Auto-redirect on success

### **Login** (`/login`)
- Email/password login
- Google OAuth option
- Remember me functionality
- Forgot password (coming soon)

### **Dashboard** (`/dashboard`)
- Overview of analyses
- Quick actions
- Recent activity
- Navigation hub

### **Upload Resume** (`/upload-resume`)
- Drag-and-drop file upload
- Job role selection
- Experience level selection
- Optional job description
- Real-time validation

### **Analysis Results** (`/analysis?id=<analysisId>`)
- Match percentage visualization
- Skills breakdown
- ATS score
- Detailed recommendations
- Download report (coming soon)
- Generate roadmap

### **Profile** (`/profile`)
- View/edit user information
- Upload profile picture
- Change password (coming soon)
- Account settings

---

## 🚢 Deployment

### **⚠️ HAVING LOGIN ISSUES ON VERCEL?** 
👉 **[See Complete Fix Guide](VERCEL_DEPLOYMENT.md)**

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/impetus-skillsnap)

#### **Quick Setup**

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Select the project

2. **Configure Environment Variables** ⚠️ CRITICAL
   - Add all variables from `.env.local`
   - **MUST include Firebase Admin credentials** (see below)
   - Use Vercel's Environment Variables section

3. **Deploy**
   - Click Deploy
   - Vercel will automatically build and deploy

4. **Post-Deployment**
   - Add your Vercel domain to Firebase authorized domains
   - Verify login/signup works

---

### **🔥 Firebase Admin Setup (CRITICAL FOR LOGIN)**

**Without these, Google login will FAIL on Vercel!**

1. Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Add these to Vercel environment variables:

```bash
FIREBASE_ADMIN_PROJECT_ID=skill-snap
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@skill-snap.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

⚠️ **Keep the quotes and `\n` characters in the private key!**

---

### **Environment Variables on Vercel**

**Required variables** (add in Vercel Dashboard → Settings → Environment Variables):

```bash
# Database
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Firebase Client (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skill-snap.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skill-snap
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skill-snap.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Backend) - CRITICAL!
FIREBASE_ADMIN_PROJECT_ID=skill-snap
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@skill-snap.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# API URL (optional, defaults to relative paths)
NEXT_PUBLIC_API_URL=/api
```

---

### **✅ Firebase Configuration Checklist**

Before deploying, ensure:

- [ ] Auth domain is `skill-snap.firebaseapp.com` (NOT `.web.app` or `localhost`)
- [ ] Your Vercel domain added to Firebase → Authentication → Authorized domains
- [ ] Firebase Admin credentials set on Vercel
- [ ] Google OAuth redirect URIs include your Vercel domain

---

### **🐛 Troubleshooting**

**Login not working?** → See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed fixes

**Quick checks:**
1. Verify all environment variables are set on Vercel
2. Check Vercel function logs: Dashboard → Deployments → Functions
3. Verify Firebase auth domain matches exactly
4. Ensure MongoDB allows connections from `0.0.0.0/0`

---

### **Other Platforms**

#### **Netlify**
- Use Netlify CLI or GitHub integration
- Add environment variables in Site Settings
- Configure build command: `npm run build`
- Publish directory: `.next`

#### **Railway**
- Connect GitHub repository
- Add environment variables
- Deploy automatically on push

#### **AWS / Docker**
- Build Docker image
- Deploy to ECS/EC2/Lambda
- Configure environment variables
- Set up load balancer

---

## 🔒 Security

This application follows security best practices and is **fully CSP-compliant**:

### Security Features

- ✅ **No unsafe code execution** - No `eval()`, `new Function()`, or string-based timers
- ✅ **Content Security Policy** - Strict CSP headers configured
- ✅ **Security headers** - HSTS, X-Frame-Options, X-XSS-Protection, etc.
- ✅ **Input validation** - All user inputs validated and sanitized
- ✅ **Secure authentication** - JWT + Firebase, bcrypt password hashing
- ✅ **MongoDB security** - IP whitelist, authenticated connections
- ✅ **HTTPS enforcement** - Automatic on Vercel/production

### Security Documentation

- 📄 [SECURITY.md](SECURITY.md) - Complete security guidelines
- 🛡️ [lib/security.js](lib/security.js) - Security utility functions
- 🔐 [middleware.js](middleware.js) - Security headers middleware

### Security Audit

```bash
# Check for npm vulnerabilities
npm audit

# Run security checks
npm audit fix
```

**For detailed security information, see [SECURITY.md](SECURITY.md)**

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] Email login works
- [ ] Google OAuth works
- [ ] Resume upload (PDF, DOC, DOCX)
- [ ] Analysis generation
- [ ] Roadmap creation
- [ ] Progress tracking
- [ ] Profile updates
- [ ] Profile picture upload

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open Pull Request**

### Code Style

- Use ESLint configuration
- Follow React/Next.js best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Google Gemini AI](https://ai.google.dev/) - AI analysis
- [Firebase](https://firebase.google.com/) - Authentication
- [Cloudinary](https://cloudinary.com/) - File storage
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📧 Support

For support, email support@impetus-skillsnap.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] PDF report export
- [ ] LinkedIn integration
- [ ] Job board integration
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered interview preparation
- [ ] Skill assessment tests

---

<div align="center">

**Built with ❤️ using Next.js, React, and AI**

[⬆ Back to Top](#impetus---skillsnap)

</div>



