# ScriptIQ Cloud Deployment Guide (Vercel + Render)

This guide provides step-by-step instructions for deploying **ScriptIQ** using the Monorepo structure (`frontend/`, `backend/`, `tests/`).

---

## 1. Backend Deployment (Render)

1. **Log in to Render**: Go to [render.com](https://render.com) and create a **New Web Service**.
2. **Connect GitHub Repository**: Select your repository (`Saksham3736/scriptiq`).
3. **Configure Service Settings**:
   - **Name**: `scriptiq-backend`
   - **Region**: Singapore (or nearest region)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Set Environment Variables** (under Environment tab):
   - `MONGODB_URI`: `<your_mongodb_connection_string>`
   - `DB_NAME`: `Agent_Doctor`
   - `GEMINI_API_KEY`: `<your_gemini_api_key>`
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: `scriptiq.sk@gmail.com`
   - `SMTP_PASS`: `<your_gmail_app_password>`
   - `SENDER_EMAIL`: `scriptiq.sk@gmail.com`
5. **Deploy**: Click **Create Web Service**. Note your live Render URL (e.g. `https://scriptiq-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

1. **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. **Import Repository**: Select your repository (`Saksham3736/scriptiq`).
3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend`
4. **Set Environment Variables**:
   - `VITE_API_BASE_URL`: `https://scriptiq-backend.onrender.com` (your Render URL)
5. **Deploy**: Click **Deploy**. Vercel will build static assets and provide a live URL (e.g., `https://scriptiq.vercel.app`).

---

## 3. Local Development (Monorepo)

- **Run Backend**:
  ```powershell
  cd backend
  ..\.venv\Scripts\python.exe -m uvicorn server:app --reload --port 8000
  ```
- **Run Frontend**:
  ```powershell
  cd frontend
  npm run dev
  ```
- **Run Diagnostic Tests**:
  ```powershell
  .venv\Scripts\python.exe -m unittest discover tests/
  ```
