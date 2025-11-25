# Scrum Poker 部署快速指南

## 🎯 快速開始

### 後端部署 (Render)

1. 訪問 https://dashboard.render.com/
2. New + → Web Service
3. 連接儲存庫，設定：
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. 環境變數：
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=*  (稍後更新)
   ```
5. 複製部署後的 URL

### 前端部署 (Vercel)

1. 訪問 https://vercel.com/dashboard
2. Add New → Project
3. 選擇儲存庫，設定：
   - Framework: Vite
   - Root Directory: `client`
4. 環境變數：
   ```
   VITE_API_URL=<你的 Render URL>
   ```
5. Deploy

### 最後步驟

回到 Render，更新 `FRONTEND_URL` 為你的 Vercel URL

## 📝 配置檔案說明

### client/vercel.json
Vercel 部署配置，定義建置命令和輸出目錄

### client/.env.example
環境變數範例，複製為 `.env.local` 用於本地開發

### server/render.yaml
Render 部署配置（可選，也可以在網頁介面設定）

## 🔧 本地開發環境變數

建立 `client/.env.local`：
```
VITE_API_URL=http://localhost:3005
```

## 📚 詳細文檔

請參考 [DEPLOYMENT.md](./DEPLOYMENT.md) 獲取完整的部署指南。
