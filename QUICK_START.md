# ONE桌遊管理系統 - 中央化儲存快速啟動

## 🚀 5 分鐘快速部署

### 步驟 1：建立 Google Sheets（1 分鐘）

1. 前往：https://sheets.google.com/
2. 建立空白試算表
3. 命名：`ONE桌遊員工資料`
4. 複製網址中的 ID：
   ```
   https://docs.google.com/spreadsheets/d/【這段就是ID】/edit
   ```

---

### 步驟 2：部署後端（2 分鐘）

1. **在 Google Sheets 中**：
   - 擴充功能 → Apps Script

2. **貼上代碼**：
   - 刪除預設代碼
   - 複製 `backend.gs` 的完整內容並貼上

3. **設定 SHEET_ID**：
   ```javascript
   const SHEET_ID = '貼上你的 Sheets ID';
   ```

4. **初始化**：
   - 函式選單 → `initializeSheet`
   - 點擊執行 ▶️
   - 授權（第一次需要）

5. **部署**：
   - 部署 → 新增部署作業
   - 類型：網路應用程式
   - 執行身分：我
   - 存取權：所有人
   - 複製網址

---

### 步驟 3：設定前端（1 分鐘）

1. **編輯 `config.js`**：
   ```javascript
   const API_CONFIG = {
       endpoint: '貼上 GAS 部署網址'
   };
   ```

2. **推送到 GitHub**：
   ```bash
   cd ~/.openclaw/workspace/one-management-portal
   git add .
   git commit -m "Add centralized backend with Google Sheets"
   git push
   ```

---

### 步驟 4：測試（1 分鐘）

1. 等待 1-2 分鐘（GitHub Pages 更新）

2. 訪問：
   ```
   https://ken0900101318-beep.github.io/one-management-portal/
   ```

3. 測試登入：
   - 帳號：`0920119696`
   - 密碼：`789456`

4. **在手機測試**（同步驗證）

---

## ✅ 完成！

現在所有裝置的員工資料都會同步！

---

## 📱 初始員工帳號

| 姓名 | 帳號 | 密碼 | 權限 |
|------|------|------|------|
| 👨‍💼 建佑 | 0920119696 | 789456 | 主管 |
| 💼 會計 | 0919759368 | 4920r035 | 會計 |
| 👨 小圓 | 0966428064 | 666666 | 主管 |
| 🧑 尼克 | willy5407 | 666666 | 員工 |

---

## 🔧 如果遇到問題

### 1. 登入失敗
- 檢查 `config.js` 的 endpoint 是否正確
- 打開開發者工具（F12）查看 Console 錯誤
- 確認 GAS 已正確部署

### 2. CORS 錯誤
- GAS 部署時「存取權」必須選「所有人」
- 重新部署並更新 endpoint

### 3. 手機無法同步
- 確認使用的是同一個 Google Sheets
- 清除手機瀏覽器快取
- 重新登入

---

## 📞 需要協助？

請提供：
1. Google Sheets ID
2. GAS 部署網址
3. Console 錯誤訊息截圖

---

**詳細文件**：請參考 `BACKEND_SETUP.md`
