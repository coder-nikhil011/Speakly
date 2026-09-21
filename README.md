# Speakly 🌍
### Master Languages with AI-Powered Tutoring and Real-Life Speaking Practice

Speakly is a comprehensive language learning platform that leverages Generative AI to bridge the gap between textbook learning and real-world conversation. It provides personalized paths for both students and teachers, making language acquisition intuitive, engaging, and data-driven.

---

## 🚀 Key Features

### For Students (Learners)
- **AI Tutor**: Get deep dives into words, including meaning, usage, real-life scenarios, and grammatical guidance.
- **Smart Learning Engine**: AI generates contextual practice sentences based on your current level and previous progress.
- **Speaking Lab**:
    - **AI Friend**: Low-pressure conversational practice.
    - **Scenario Practice**: Simulate real-world situations (e.g., ordering coffee, job interviews).
    - **Speaking Feedback**: Get instant AI analysis on your pronunciation and fluency.
- **Intelligent Revision**: AI-generated fill-in-the-blank questions based on your weak areas.
- **Gamification**: Daily challenges and contests to keep the learning streak alive.

### For Teachers
- **AI Teaching Assistant**: Automate content creation and get AI suggestions for student learning paths.
- **Student Analytics**: Track student progress, identify weak areas, and monitor mastery of specific words.
- **Content Management**: Create and manage custom assignments and lessons for your students.
- **Classroom Overview**: A bird's-eye view of all students' performance and learning trends.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS (Styling)
- React Router Dom (Navigation)
- Axios (API Communication)

**Backend**
- Node.js + Express
- MongoDB + Mongoose (Database)
- Passport.js (Google & Microsoft OAuth)
- JWT (Authentication)

**AI Integration**
- OpenAI API (GPT-4o) for tutoring, content generation, and feedback.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Account (Atlas or Local)
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/speakly.git
   cd speakly
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   MICROSOFT_CLIENT_ID=your_ms_id
   MICROSOFT_CLIENT_SECRET=your_ms_secret
   ```
   Start the server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the app:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure
```text
Speakly/
├── backend/
│   ├── config/         # DB and Passport configurations
│   ├── controllers/    # AI and User business logic
│   ├── models/         # Mongoose schemas (User, Word, Sentence, etc.)
│   ├── routes/         # API endpoints
│   ├── services/       # AI Service integration (OpenAI)
│   └── middleware/     # Auth and AI usage guards
└── frontend/
    ├── src/
    │   ├── components/ # UI Components (Tutor, Dashboard, etc.)
    │   └── services/   # API helper functions
    └── public/         # Static assets
```

---

## 📄 License
This project is licensed under the MIT License.
