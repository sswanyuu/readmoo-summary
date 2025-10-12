# 重新載入擴充功能步驟

## 方法 1：重新載入（推薦）

1. 打開 Chrome：`chrome://extensions/`
2. 啟用「開發人員模式」
3. 找到 "Readmoo Summary Extension"
4. 點擊重新載入按鈕 🔄

## 方法 2：完全重新安裝

1. 打開 Chrome：`chrome://extensions/`
2. 移除舊的擴充功能
3. 點擊「載入未封裝項目」
4. 選擇 `dist` 資料夾

## 驗證編譯成功

```bash
npm run build:dev
```

應該看到：

```
webpack 5.102.1 compiled successfully
```

## 檢查 Service Worker

1. 在 chrome://extensions/ 找到擴充功能
2. 點擊「Service Worker」連結
3. 查看是否有錯誤訊息
