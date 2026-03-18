# ONE桌遊管理系統 - 中央化儲存設定指南

## 🎯 目標

將員工資料從 localStorage（本地儲存）改為 Google Sheets（雲端中央化儲存），實現跨裝置同步。

---

## 📋 步驟 1：建立 Google Sheets

1. **前往 Google Sheets**：https://sheets.google.com/

2. **建立新試算表**：
   - 點擊「空白」建立
   - 命名：`ONE桌遊員工資料`

3. **取得 Sheets ID**：
   - 網址格式：`https://docs.google.com/spreadsheets/d/【這串就是ID】/edit`
   - 例如：`1abc123def456ghi789jkl`
   - **複製這個 ID**

---

## 📋 步驟 2：部署 Google Apps Script

1. **開啟 Apps Script**：
   - 在 Google Sheets 中：擴充功能 → Apps Script

2. **貼上後端代碼**：
   - 刪除預設的 `function myFunction() {...}`
   - 複製 `backend.gs` 的完整內容
   - 貼上到編輯器

3. **修改 Sheets ID**：
   ```javascript
   const SHEET_ID = '請填入你的 Google Sheets ID';
   ```
   改為：
   ```javascript
   const SHEET_ID = '1abc123def456ghi789jkl';  // 你的 ID
   ```

4. **初始化資料表**：
   - 點擊上方的函式選單 → 選擇 `initializeSheet`
   - 點擊「執行」▶️
   - **第一次執行會要求授權**：
     1. 點擊「審查權限」
     2. 選擇你的 Google 帳號
     3. 點擊「進階」
     4. 點擊「前往 XXX（不安全）」
     5. 點擊「允許」
   - 回到 Google Sheets，應該會看到「員工資料」工作表

5. **部署為網路應用程式**：
   - 點擊右上角「部署」→「新增部署作業」
   - 類型：選擇「網路應用程式」
   - 說明：`ONE桌遊員工管理 API v1.0`
   - 執行身分：**我**
   - 具有存取權的使用者：**所有人**
   - 點擊「部署」
   - **複製「網路應用程式網址」**
   - 格式：`https://script.google.com/macros/s/ABC.../exec`

---

## 📋 步驟 3：測試 API

在瀏覽器訪問（替換成你的網址）：
```
https://script.google.com/macros/s/你的部署ID/exec?action=test
```

應該會看到：
```json
{
  "success": true,
  "message": "ONE桌遊員工管理系統 API 正常運作",
  "timestamp": "2026-03-18T14:13:00.000Z"
}
```

---

## 📋 步驟 4：更新前端代碼

### 4.1 建立 API 配置檔

建立 `config.js`：
```javascript
const API_CONFIG = {
    endpoint: 'https://script.google.com/macros/s/你的部署ID/exec'
};
```

### 4.2 更新 `index.html`（登入頁面）

在 `<head>` 加入：
```html
<script src="config.js"></script>
<script src="api.js"></script>
```

修改登入處理：
```javascript
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        const result = await API.login(username, password);
        
        if (result.success) {
            // 登入成功
            localStorage.setItem('oneCurrentUser', JSON.stringify(result.user));
            window.location.href = 'menu.html';
        } else {
            alert('❌ ' + result.error);
        }
    } catch (error) {
        alert('❌ 登入失敗：' + error.message);
    }
});
```

### 4.3 更新 `user-management.html`（員工管理）

修改 `loadUsers()` 函式：
```javascript
async function loadUsers() {
    try {
        const result = await API.getUsers();
        
        if (result.success) {
            users = result.users;
            // 更新表格...
        }
    } catch (error) {
        alert('載入員工資料失敗：' + error.message);
    }
}
```

修改 `saveUser()` 函式：
```javascript
async function saveUser() {
    // ... 驗證邏輯 ...
    
    try {
        let result;
        if (editingUserId) {
            result = await API.updateUser(editingUserId, {
                avatar, name, username, password, role
            });
        } else {
            result = await API.addUser({
                avatar, name, username, password, role
            });
        }
        
        if (result.success) {
            alert('✅ ' + result.message);
            loadUsers();
        }
    } catch (error) {
        alert('❌ 儲存失敗：' + error.message);
    }
}
```

---

## 📋 步驟 5：建立 API 工具函式

建立 `api.js`：
```javascript
const API = {
    /**
     * 發送 POST 請求
     */
    async request(action, data = {}) {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: action,
                ...data
            })
        });
        
        // 因為 no-cors，需要用 redirect 方式取得回應
        const result = await response.json();
        return result;
    },
    
    /**
     * 登入
     */
    async login(username, password) {
        return await this.request('login', { username, password });
    },
    
    /**
     * 取得所有員工
     */
    async getUsers() {
        return await this.request('getUsers');
    },
    
    /**
     * 新增員工
     */
    async addUser(user) {
        return await this.request('addUser', { user });
    },
    
    /**
     * 更新員工
     */
    async updateUser(userId, user) {
        return await this.request('updateUser', { userId, user });
    },
    
    /**
     * 刪除員工
     */
    async deleteUser(userId) {
        return await this.request('deleteUser', { userId });
    }
};
```

---

## 📋 步驟 6：部署並測試

1. **推送到 GitHub**：
   ```bash
   git add .
   git commit -m "Migrate to centralized Google Sheets backend"
   git push
   ```

2. **等待 GitHub Pages 更新**（1-2 分鐘）

3. **清除瀏覽器快取**

4. **測試功能**：
   - 登入
   - 新增員工
   - 修改員工
   - 刪除員工
   - **在手機測試登入**（應該能看到相同資料）

---

## ✅ 完成！

現在員工資料會儲存在 Google Sheets 中，所有裝置都會同步！

---

## 🔧 維護說明

### 查看員工資料
直接打開 Google Sheets：
https://docs.google.com/spreadsheets/d/你的ID/edit

### 手動修改資料
直接在 Google Sheets 編輯即可，前端會自動同步。

### 備份資料
Google Sheets 自動備份，也可以手動匯出為 Excel。

### 更新 API
修改 `backend.gs` 後：
1. 儲存
2. 部署 → 管理部署作業
3. 編輯 → 新版本
4. 部署

---

## ⚠️ 安全建議

1. **不要公開 Google Sheets**：
   - 分享設定：僅限特定人員

2. **密碼加密**（進階）：
   - 目前密碼明碼儲存
   - 未來可加入 SHA-256 加密

3. **API 限流**（進階）：
   - GAS 預設每分鐘 60 次請求
   - 足夠一般使用

---

**需要協助？** 回報問題時請提供：
- Google Sheets ID
- API 網址
- Console 錯誤訊息
