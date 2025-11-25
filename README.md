# Scrum Poker 應用程式

這是一個使用 Node.js, Socket.IO, Vue 3 和 Tailwind CSS 構建的即時 Scrum 估點工具。

## 前置需求

- Node.js (建議 v20+)
- npm

## 安裝步驟

1.  **伺服器端 (Server) 設定**
    ```bash
    cd server
    npm install
    ```

2.  **客戶端 (Client) 設定**
    ```bash
    cd client
    npm install
    ```

## 啟動應用程式

您需要在兩個不同的終端機 (Terminal) 視窗中分別啟動後端與前端。

### 1. 啟動後端伺服器

```bash
cd server
npm start
```
伺服器將會在 `http://localhost:3005` 上運行。

### 2. 啟動前端客戶端

```bash
cd client
npm run dev
```
客戶端通常會在 `http://localhost:5175` (如果該端口被佔用，則可能是 `5176`) 上運行。

## 使用說明

1.  在瀏覽器中打開客戶端網址。
2.  輸入您的名字和房間 ID (例如："Planning01")。
3.  將房間 ID 分享給其他團隊成員。
4.  開始估點！
