# 🚀 Vidyodaya AI — Cloud Deployment Guide

This guide walks you through deploying **Vidyodaya AI** to modern, reliable cloud hosts with **high performance, no credit card hassles, and fast responses**.

---

## ⚡ Comparison of Easy Platforms (No Credit Card Needed)

| Platform | Free Specs | Credit Card? | Cold Starts? | Best For |
|---|---|---|---|---|
| 🥇 **Hugging Face Spaces** | **2 vCPUs + 16 GB RAM** | ❌ None | ⚡ Fast wake | **#1 Pick for AI** — Completely free, massive hardware, no credit card, never blocked. |
| 🥈 **Zeabur** | Fast Cloud Container | ❌ None | ⚡ Low latency | **Ultra simple 1-click** GitHub deploy with servers in Asia/Global. |
| 🥉 **Render (Keep Existing)** | 0.1 vCPU + 512 MB | ❌ None | ⚠️ Sleeps (fix with pinger) | Already deployed! Just add a free keep-alive monitor. |

---

## 🥇 Option 1: Deploy on Hugging Face Spaces (Recommended — 100% Free, 2 vCPU + 16GB RAM)

Hugging Face Spaces is the premier free platform for hosting AI web applications:
- **No credit card** required ever.
- **Huge hardware:** 2 dedicated vCPUs and 16 GB RAM on the free tier (20x more power than Render!).
- **Docker-ready:** This repository already includes the required Hugging Face metadata in [`README.md`](file:///c:/vidyodaya-ai/README.md) and [`Dockerfile`](file:///c:/vidyodaya-ai/Dockerfile).

### Steps:
1. Create a free account at [huggingface.co](https://huggingface.co/) (sign up with GitHub in 10 seconds).
2. Go to [huggingface.co/new-space](https://huggingface.co/new-space).
3. Fill in:
   - **Space name:** `vidyodaya-ai`
   - **License:** `mit`
   - **Select the Space SDK:** Click **Docker** → choose **Blank**.
   - **Space Hardware:** Choose **Free - 2 vCPU · 16GB RAM**.
   - **Visibility:** Public.
4. Click **Create Space**.
5. Connect your GitHub repository:
   - On the new Space page, click the **Settings** tab.
   - Under **Repository**, click **Connect a GitHub repository** and select `RAFISk7867/vidyodaya-ai`.
   *(Or click "Sync with GitHub" / push directly to the Hugging Face Git remote).*
6. In the **Settings** tab, scroll to **Variables and secrets** and add two Secrets:
   - `GEMINI_API_KEY`: *your Google Gemini API key*
   - `SECRET_KEY`: `vidyodaya-super-secret-key-educational-production-2025-ai`
7. Click **Save**. Hugging Face will automatically build your Docker container on port `7860` and launch your app with huge compute power!

---

## 🥈 Option 2: Deploy on Zeabur (Super Fast & Smooth)

Zeabur (`zeabur.com`) is a modern developer platform that deploys Docker containers from GitHub in seconds without requiring credit cards or complicated network configuration.

### Steps:
1. Go to [zeabur.com](https://zeabur.com/) and sign in with GitHub.
2. Click **Create Project** → Choose region closest to you (e.g. **Asia-East** or **US**).
3. Click **Deploy New Service** → **Git** → select `RAFISk7867/vidyodaya-ai`.
4. Zeabur automatically detects the `Dockerfile`.
5. Under **Variables**, add:
   - `GEMINI_API_KEY` = *your_gemini_api_key*
   - `SECRET_KEY` = `vidyodaya-super-secret-key-educational-production-2025-ai`
   - `PORT` = `8000`
   - `GEMINI_MODEL` = `gemini-flash-lite-latest`
6. Under **Domains**, click **Generate Domain** to get a free `.zeabur.app` URL.
7. Done! Zeabur builds and runs your container with high network speeds.

---

## 🥉 Option 3: Keep Your Existing Render Deployment & Fix the Speed

Since your app is **already deployed on Render**, you don't even have to migrate anywhere else! You can eliminate the slowness with two quick actions:

### Fix 1: Switch to the Ultra-Fast Model
In your deployed Render app:
1. Go to the **Settings** page.
2. Under **Google Gemini API Integration**, change the **Active AI Engine** dropdown to:  
   **`⚡ gemini-flash-lite-latest (Ultra Fast / Lowest Latency)`**.
3. Response latency will drop from 12+ seconds to 1-2 seconds.

### Fix 2: Stop Render from Sleeping (Eliminate 50s Cold Starts)
Render free tier sleeps when inactive for 15 minutes. Use a free pinger so it stays awake 24/7:
1. Go to [cron-job.org](https://cron-job.org/) or [uptimerobot.com](https://uptimerobot.com/) (both free, no credit card).
2. Create a free HTTP ping to your Render health endpoint:  
   `https://<your-app-name>.onrender.com/api/health`  
   Set the interval to **every 10 minutes**.
3. Render will stay permanently awake with zero cold starts!

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
   - `GEMINI_MODEL` = `gemini-3.8-flash`
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
