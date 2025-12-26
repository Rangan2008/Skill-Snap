# SkillSnap

**AI-Powered Resume Analysis & Career Development Platform**
Transform your career journey with intelligent resume analysis, skill gap identification, and personalized learning roadmaps.

**Tech Stack:** Next.js • React • MongoDB • Firebase • Tailwind CSS • Gemini AI

---

## 📋 Table of Contents

* Overview
* Features
* Tech Stack
* Project Structure
* Prerequisites
* Installation
* Environment Setup
* Running the Application
* API Endpoints
* Pages & Features
* Deployment
* Security
* Testing
* Contributing
* License
* Authors
* Roadmap

---

## 🎯 Overview

**SkillSnap (IMPETUS)** is a comprehensive career development platform that leverages AI to analyze resumes, identify skill gaps, and generate personalized learning roadmaps. Built with **Next.js 16** and **Google Gemini AI**, it provides actionable insights to bridge the gap between current skills and target job requirements.

### How It Works

1. **Upload Resume** – PDF, DOC, or DOCX
2. **Select Target Role** – Job role & experience level
3. **AI Analysis** – Gemini AI evaluates resume vs requirements
4. **Get Insights** – Match score, ATS score, skill gaps
5. **Track Progress** – Follow AI-generated learning roadmaps

---

## ✨ Features

### 🔐 Authentication & User Management

* Email/password authentication with JWT
* Google OAuth via Firebase
* Secure profile management
* Profile picture upload (Cloudinary)
* Persistent sessions

### 📄 Resume Analysis

* Multi-format support (PDF, DOC, DOCX)
* Drag-and-drop upload
* Job role & experience selection
* Optional job description for enhanced matching
* Real-time AI-powered processing

### 📊 Intelligent Analytics Dashboard

* Resume–Job **Match Percentage**
* Skills breakdown (found, missing, nice-to-have)
* **ATS Score** (Applicant Tracking System compatibility)
* Actionable recommendations
* Historical analysis tracking

### 🗺️ Personalized Learning Roadmaps

* AI-generated learning paths
* Phase-based structure
* Curated resources & courses
* Progress tracking with checkpoints
* Timeline estimation

### 👤 User Dashboard

* Upload history
* Analysis overview
* Roadmap progress tracking
* Profile & account management

---

## 🛠 Tech Stack

### Frontend

* **Next.js 16.0.10** – App Router, API Routes
* **React 18.2.0** – UI Components
* **Tailwind CSS 3.4.8** – Styling
* **Framer Motion** – Animations
* **Lucide React** – Icons

### Backend & Services

* **Next.js API Routes** – Backend APIs
* **MongoDB (Mongoose)** – Database
* **Firebase Auth & Admin** – Google OAuth & token verification
* **Cloudinary** – File storage & CDN
* **Google Gemini AI** – Resume analysis & recommendations

### AI & Document Processing

* @google/generative-ai
* pdf-parse (PDF extraction)
* mammoth (DOCX extraction)
* natural (NLP utilities)

---

## 📁 Project Structure

```
IMPETUS-Complete/
├── app/            # Next.js App Router
│   ├── api/        # Backend API routes
│   ├── dashboard/  # User dashboard
│   ├── login/      # Login page
│   ├── signup/     # Registration
│   ├── profile/    # Profile page
│   └── upload-resume/
├── components/     # Reusable React components
├── contexts/       # Auth context
├── lib/            # Utilities, models, services
├── middleware/     # Auth & DB middleware
├── public/         # Static assets
├── styles/         # Global styles
└── package.json
```

---

## 🔧 Prerequisites

* Node.js **18.17.0+**
* npm / yarn / pnpm
* MongoDB (local or Atlas)
* Git

### Required Accounts

* MongoDB Atlas
* Firebase
* Cloudinary
* Google AI Studio (Gemini API key)

---

## 📥 Installation

```bash
git clone https://github.com/yourusername/impetus-skillsnap.git
cd impetus-skillsnap
npm install
```

---

## 🔑 Environment Setup

Create `.env.local` and add:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🚀 Running the Application

```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 API Endpoints (Sample)

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/google`
* `GET /api/auth/me`

### Resume Analysis

* `POST /api/resume/analyze`
* `GET /api/resume-analysis`
* `GET /api/resume-analysis/[id]`

### Roadmaps

* `GET /api/roadmap/[analysisId]`
* `PATCH /api/roadmap/progress/[analysisId]`

---

## 🚢 Deployment

**Recommended:** Vercel

Steps:

1. Import GitHub repo into Vercel
2. Add all environment variables
3. Add Firebase Admin credentials
4. Deploy

⚠️ Ensure your Vercel domain is added to **Firebase Authorized Domains**.

---

## 🔒 Security

* JWT-based authentication
* Firebase OAuth verification
* Secure password hashing (bcrypt)
* CSP & security headers
* Input validation & sanitization

---

## 🧪 Testing

* User registration & login
* Google OAuth
* Resume upload & analysis
* Roadmap generation
* Progress tracking

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 📝 License

MIT License

---

## 👥 Authors

**Rangan Das** – Initial development

---

## 🗺️ Roadmap

* PDF report export
* LinkedIn integration
* Job board integration
* Mobile app (React Native)
* AI interview preparation

---

Built with ❤️ using **Next.js, React, and AI**
