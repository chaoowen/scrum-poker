# Scrum Poker 部署指南

本指南將協助你將 Scrum Poker 應用部署到雲端平台：
- **前端**: Vercel
- **後端**: Render

---

## 📋 部署前準備

### 1. 確保程式碼已推送到 Git 儲存庫

你需要將專案推送到 GitHub、GitLab 或 Bitbucket。

```bash
# 如果還沒有初始化 git
git init
git add .
git commit -m "Initial commit"

# 推送到遠端儲存庫（替換成你的儲存庫 URL）
git remote add origin https://github.com/your-username/scrum-poker.git
git branch -M main
git push -u origin main
```

### 2. 註冊帳號

- [Vercel](https://vercel.com) - 使用 GitHub 帳號登入
- [Render](https://render.com) - 使用 GitHub 帳號登入

---

## 🚀 後端部署 (Render)

> **為什麼先部署後端？** 因為前端需要後端的 URL 才能正確連接。

### 步驟 1: 建立新的 Web Service

1. 登入 [Render Dashboard](https://dashboard.render.com/)
2. 點擊 **"New +"** → 選擇 **"Web Service"**
3. 連接你的 Git 儲存庫
4. 選擇 `scrum-poker` 儲存庫

### 步驟 2: 配置服務設定

填寫以下資訊：

| 欄位 | 值 |
|------|-----|
| **Name** | `scrum-poker-server`（或你喜歡的名稱） |
| **Region** | 選擇離你最近的區域（例如：Singapore） |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 步驟 3: 設定環境變數

在 **Environment Variables** 區塊，新增以下變數：

| Key | Value | 說明 |
|-----|-------|------|
| `NODE_ENV` | `production` | 設定為生產環境 |
| `PORT` | `10000` | Render 預設使用 10000 port |
| `FRONTEND_URL` | `https://scrum-poker-by-cora.vercel.app/` | **稍後填寫**（先留空或填 `*`） |

> ⚠️ **注意**: `FRONTEND_URL` 需要在前端部署完成後再回來更新！

### 步驟 4: 部署

1. 點擊 **"Create Web Service"**
2. 等待部署完成（約 2-5 分鐘）
3. 部署成功後，你會看到一個 URL，例如：`https://scrum-poker-server-by84.onrender.com`

### 步驟 5: 測試後端

開啟瀏覽器訪問你的後端 URL，應該會看到 "Cannot GET /"（這是正常的，因為我們沒有設定根路由）。

**複製這個 URL**，稍後前端部署會用到！

---

## 🎨 前端部署 (Vercel)

### 步驟 1: 建立新專案

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 **"Add New..."** → 選擇 **"Project"**
3. 選擇你的 Git 儲存庫 `scrum-poker`

### 步驟 2: 配置專案設定

填寫以下資訊：

| 欄位 | 值 |
|------|-----|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 步驟 3: 設定環境變數

在 **Environment Variables** 區塊，新增：

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://scrum-poker-server-by84.onrender.com` |

> 📝 **重要**: 將上面的 URL 替換成你在 Render 部署的後端 URL！

### 步驟 4: 部署

1. 點擊 **"Deploy"**
2. 等待建置和部署完成（約 1-3 分鐘）
3. 部署成功後，你會看到一個 URL，例如：`https://scrum-poker-by-cora.vercel.app/`

### 步驟 5: 更新後端 CORS 設定

現在回到 Render，更新後端的環境變數：

1. 進入你的 Render 服務頁面
2. 點擊左側 **"Environment"**
3. 找到 `FRONTEND_URL` 變數
4. 更新為你的 Vercel URL：`https://scrum-poker-by-cora.vercel.app/`
5. 點擊 **"Save Changes"**
6. Render 會自動重新部署

---

## ✅ 驗證部署

### 測試流程

1. 開啟你的 Vercel URL（前端）
2. 建立一個新房間
3. 輸入你的名字並加入
4. 開啟另一個瀏覽器分頁（或無痕模式）
5. 使用相同的房間代碼加入
6. 測試投票功能

### 常見問題排查

#### 問題 1: 無法連接到後端

**症狀**: 前端顯示連接錯誤或無法加入房間

**解決方法**:
1. 檢查 Vercel 的環境變數 `VITE_API_URL` 是否正確
2. 確認 Render 服務正在運行（綠色狀態）
3. 檢查瀏覽器控制台的錯誤訊息

#### 問題 2: CORS 錯誤

**症狀**: 瀏覽器控制台顯示 CORS policy 錯誤

**解決方法**:
1. 確認 Render 的 `FRONTEND_URL` 環境變數已設定
2. 確認 URL 沒有多餘的斜線（例如：`https://example.com` 而非 `https://example.com/`）
3. 重新部署 Render 服務

#### 問題 3: Render 服務休眠

**症狀**: 第一次訪問時需要等待 30 秒以上

**說明**: Render 免費方案會在 15 分鐘無活動後休眠服務。這是正常現象。

**解決方法**:
- 升級到付費方案（$7/月起）
- 或接受第一次訪問較慢的情況

---

## 🔄 後續更新

### 更新前端

1. 修改程式碼並推送到 Git
2. Vercel 會自動偵測並重新部署

### 更新後端

1. 修改程式碼並推送到 Git
2. Render 會自動偵測並重新部署

### 手動觸發部署

**Vercel**:
- 進入專案頁面 → Deployments → 點擊 "Redeploy"

**Render**:
- 進入服務頁面 → 點擊右上角 "Manual Deploy" → "Deploy latest commit"

---

## 📊 監控和日誌

### Vercel

1. 進入專案頁面
2. 點擊 **"Deployments"** 查看部署歷史
3. 點擊 **"Functions"** 查看日誌（如果有使用 API Routes）

### Render

1. 進入服務頁面
2. 點擊 **"Logs"** 查看即時日誌
3. 點擊 **"Metrics"** 查看效能指標

---

## 💰 費用說明

### Vercel 免費方案限制

- ✅ 無限專案
- ✅ 100 GB 頻寬/月
- ✅ 自動 HTTPS
- ✅ 自動 CI/CD

### Render 免費方案限制

- ✅ 750 小時/月（足夠單一服務全月運行）
- ⚠️ 15 分鐘無活動後休眠
- ⚠️ 每月 100 GB 頻寬
- ✅ 自動 HTTPS

---

## 🎉 完成！

你的 Scrum Poker 應用現在已經部署到雲端了！

**前端 URL**: `https://your-app.vercel.app`  
**後端 URL**: `https://your-app.onrender.com`

分享你的前端 URL 給團隊成員，開始使用吧！

---

## 📚 進階配置

### 自訂網域

**Vercel**:
1. 進入專案設定 → Domains
2. 新增你的網域
3. 按照指示設定 DNS

**Render**:
1. 進入服務設定 → Custom Domain
2. 新增你的網域
3. 按照指示設定 DNS

### 環境變數管理

建議為不同環境設定不同的環境變數：

- **開發環境**: 使用 `.env.local`（不要提交到 Git）
- **生產環境**: 在 Vercel/Render 平台設定

### 效能優化

1. **啟用 Gzip 壓縮**（Vercel 預設啟用）
2. **使用 CDN**（Vercel 預設使用）
3. **優化圖片**（如果有使用）
4. **程式碼分割**（Vite 預設支援）

---

## 🆘 需要幫助？

如果遇到問題，可以：

1. 查看 [Vercel 文檔](https://vercel.com/docs)
2. 查看 [Render 文檔](https://render.com/docs)
3. 檢查瀏覽器控制台的錯誤訊息
4. 檢查 Render 的日誌
