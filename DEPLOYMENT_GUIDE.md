# 🚀 Vidyodaya AI — Cloud Deployment Guide

This guide walks you through deploying **Vidyodaya AI** to modern cloud platforms with **high performance, low latency, and zero cold starts**.

---

## ⚡ Quick Comparison: Which Platform Is Best?

| Platform | Cold Starts (Sleep)? | Speed & CPU | Free Allowance | Recommendation |
|---|---|---|---|---|
| 🥇 **Railway** | **NO** (Runs 24/7) | ⚡⚡⚡ Ultra Fast (up to 8 vCPU) | \$5 free credit / trial | **#1 Recommended** — Best overall speed & developer experience. Already pre-configured in this repo! |
| 🥈 **Koyeb** | **NO** (Zero spin-down) | ⚡⚡⚡ Very Fast (MicroVMs) | 1 Web Service Free 24/7 | **Best 100% Free** alternative with zero sleeping. |
| 🥉 **Render** | **YES** (Sleeps after 15 min) | ⚡ Slow on free tier (0.1 vCPU) | 750 free hours/month | Budget free option, but has 30-50s wake delays. |

---

## 🥇 Option 1: Deploy to Railway (Recommended — Fastest & Easiest)

Railway does not spin your containers down to sleep, has significantly more CPU power than Render, and this repository is **already pre-configured** with [`railway.json`](file:///c:/vidyodaya-ai/railway.json).

### Steps:
1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **+ New Project** → **Deploy from GitHub repo**.
3. Select your repository: `RAFISk7867/vidyodaya-ai`.
4. Railway will automatically detect the root `Dockerfile` and `railway.json`.
5. Click on the newly created service tile, go to the **Variables** tab, and add:
   - `GEMINI_API_KEY` = *your_gemini_api_key*
   - `SECRET_KEY` = `vidyodaya-super-secret-key-educational-production-2025-ai`
   - `GEMINI_MODEL` = `gemini-flash-lite-latest`
6. Go to **Settings** → **Networking** → Click **Generate Domain**.
7. In ~2 minutes, Railway will build and deploy your app at a live `*.up.railway.app` URL with instant responses!

---

## 🥈 Option 2: Deploy to Koyeb (Best 100% Free Tier with NO Sleeping)

Koyeb offers a **Free "Eco" tier that never spins down**, giving you 24/7 uptime without Render's 50-second wake delay.

### Steps:
1. Go to [Koyeb.com](https://www.koyeb.com/) and create a free account.
2. Click **Create App** → Choose **GitHub**.
3. Select your `RAFISk7867/vidyodaya-ai` repository.
4. Under **Builder**, select **Dockerfile** (Koyeb auto-detects the root `Dockerfile`).
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = *your_gemini_api_key*
   - `SECRET_KEY` = `vidyodaya-super-secret-key-educational-production-2025-ai`
   - `PORT` = `8000`
   - `GEMINI_MODEL` = `gemini-flash-lite-latest`
6. Under **Ports**, ensure Port `8000` is mapped to HTTP route `/`.
7. Click **Deploy**. Koyeb will build the multi-stage Docker container and launch your app with a global CDN and automatic SSL!

---

## 🥉 Option 3: Deploy to Render (Free with Cold Starts)

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
