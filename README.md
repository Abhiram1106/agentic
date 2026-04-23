# Student Support Agent - Hackathon MVP

The **Student Support Agent** is a full-stack AI-driven platform designed to centralize academic information for students. It leverages LLMs to provide personalized support while grounding answers in structured institutional data.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- OpenAI API Key

### 2. Environment Setup
Create a `.env` file in the `server` directory based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

### 3. Installation
From the root directory:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Seed Demo Data
Populate the database with realistic academic data:
```bash
npm run seed
```

### 5. Run Application
Start both frontend and backend concurrently:
```bash
npm run dev
```

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Zustand (State), Axios.
- **Backend**: Node.js, Express, Mongoose, JWT Auth.
- **AI**: OpenAI GPT-3.5 Turbo for grounded query handling.

---

## 🏗 Key Features & Modules

### 1. AI Assistant Chat
- Grounded in database data (Exams, Electives, Policies).
- Personalized responses based on student profile (Dept, Year).
- Suggestion chips for common queries.

### 2. Academic Calendar
- Centralized view of all academic events.
- Color-coded badges for Exams, Holidays, and Workshops.
- Timeline view for easy scheduling.

### 3. Electives Module
- Browse professional and open electives.
- Filter by type and department.
- Simulated registration flow with seating capacity tracking.

### 4. Policy Center
- Searchable directory of institutional rules.
- Summarized versions for quick reading by the AI.
- Deep-dive modals for full policy text.

### 5. Admin Dashboard
- Management interface for college administrators.
- CRUD operations for updating academic resources in real-time.

---

## 📁 Project Structure

```text
student-support-agent/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── layouts/        # Dashboard & Auth structures
│   │   ├── pages/          # Feature pages
│   │   ├── store/          # Zustand State
│   │   └── services/       # API integration
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # AI & DB logic
│   │   └── scripts/        # Seeding utility
└── package.json            # Root scripts
```
