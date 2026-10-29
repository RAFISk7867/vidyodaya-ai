# 🚀 Vidyodaya AI — Cloud Deployment Guide

This guide walks you through deploying **Vidyodaya AI** as a unified full-stack application to **Render** or **Railway**.

---

## 🏗️ Architecture in Production

Vidyodaya AI is configured as a single unified service:
1. **Frontend:** React + Vite is compiled into optimized static assets (`frontend/dist`).
2. **Backend:** FastAPI serves the API endpoints under `/api/...` and serves the compiled React SPA for all user routes (with automatic SPA fallback for React Router).
3. **Benefits:**
   - Single free-tier service (1 URL for both frontend and backend).
   - Zero CORS configuration problems.
   - Built-in HTTPS/SSL.
   - Database and PDF storage self-contained.

---

## 🌟 Option A: Deploy to Render (Recommended)

### Step 1: Push your code to GitHub
If you haven't already created a GitHub repository:
1. Go to [GitHub](https://github.com/new) and create a new repository named `vidyodaya-ai` (Public or Private).
2. Push your local repository to GitHub:
   ```bash
   cd C:\vidyodaya-ai
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/vidyodaya-ai.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Choose **Build and deploy from a Git repository**, and select your `vidyodaya-ai` repository.
4. Render will auto-detect the configuration from `render.yaml` or you can select:
   - **Name:** `vidyodaya-ai`
   - **Language / Environment:** `Docker`
   - **Region:** Any (e.g. Oregon or Frankfurt)
   - **Branch:** `main`
   - **Plan:** `Free`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `SECRET_KEY` = `vidyodaya-super-secret-key-educational-production-2025-ai`
   - `GEMINI_MODEL` = `gemini-2.5-flash`
6. Click **Deploy Web Service**.

Render will automatically run the multi-stage `Dockerfile`, build the React frontend, package the FastAPI backend, and publish your site at:
`https://vidyodaya-ai.onrender.com`

---

## 🚂 Option B: Deploy to Railway

### Step 1: Push code to GitHub
Ensure your repository is pushed to GitHub as described above.

### Step 2: Deploy on Railway
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your `vidyodaya-ai` repository.
4. Railway will automatically detect the root `Dockerfile` and `railway.json`.
5. Go to the project **Variables** tab and add:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `SECRET_KEY` = `vidyodaya-super-secret-key-educational-production-2025-ai`
   - `PORT` = `8000`
6. Go to **Settings** > **Networking** > **Generate Domain**.
7. Railway will build and launch your application at your custom `.up.railway.app` URL!

---

## 🐳 Option C: Run with Docker Locally or on any VPS

If you have Docker installed on your computer or a cloud virtual machine (e.g., AWS EC2, DigitalOcean, Linode):

```bash
cd C:\vidyodaya-ai

# Build the production Docker image
docker build -t vidyodaya-ai .

# Run the container
docker run -d \
  -p 8000:8000 \
  -e GEMINI_API_KEY="your_api_key_here" \
  -e SECRET_KEY="your_secret_key" \
  --name vidyodaya-app \
  vidyodaya-ai
```

Then visit **http://localhost:8000** to access the complete application!
