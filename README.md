# AI Meeting Summarizer

A full-stack web app to summarize meeting transcripts and share them via email.

## Live Demo
[https://ai-meeting-summarizer-sharer.onrender.com](https://ai-meeting-summarizer-sharer.onrender.com)

---

## Features
- Upload or paste meeting transcripts (`.txt` / `.docx`)
- Summarize transcripts using AI
- Send summaries via email
- React frontend + Node.js/Express backend + MongoDB

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/DhruviKhanpara/AI-Meeting-summarizer-sharer.git
cd AI-Meeting-summarizer-sharer
```

---

### Quick Start
1. Start backend: `npm run start` in backend folder
2. Start frontend in dev mode (if needed): `npm run dev` in frontend folder

---

### Backend
```bash
cd backend
cp .env.example .env
# Update .env with MongoDB URI and other config
npm install
npm start
```

Runs at http://localhost:5000 (or PORT in .env)

### Frontend
```bash
cd ../frontend
npm install
npm run build
```

Backend serves React build in production.

---

## File Upload

- Uploaded files go to `backend/src/uploads/` inside the server container  
- **Warning:** Files are temporary; use cloud storage for persistence
- Uploaded files are stored **temporarily** inside the server container; they will be lost on redeploys.

---

## Environment Variables

- `MONGO_URI` – MongoDB connection string  
- `PORT` – Server port  
- `GEMINI_API_KEY` - gemini key
- `EMAIL_USER` – send emails from this account
- `EMAIL_PASS` - Email pass key generate for App
- `VITE_BACKEND_URL` – Backend URL for frontend API

> Ensure `VITE_BACKEND_URL` points to your backend when running frontend locally.

---

## Deployment

- Deployed on Render  
- Frontend served via Express static files

---

## Notes

- Supported file types: `.txt`, `.docx` 
- Manual paste available if file upload fails  
- Consider persistent storage for production use
 
 ---

## API Endpoints

- `GET /api/helthCheck` – Check backend status
- `POST /api/transcripts/file` – Upload transcript file
- `POST /api/transcripts/manual` – Submit manual transcript
- `POST /api/summary` – Generate summary
- `POST /api/email` – Send summary via email
