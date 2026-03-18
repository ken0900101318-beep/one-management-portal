/**
 * ONE桌遊管理系統 - API 配置
 * 
 * 🔧 部署步驟：
 * 1. 建立 Google Sheets（詳見 BACKEND_SETUP.md）
 * 2. 部署 Google Apps Script（backend.gs）
 * 3. 將部署的網址填入下方 endpoint
 * 
 * 格式：https://script.google.com/macros/s/【你的部署ID】/exec
 */

const API_CONFIG = {
    // ⚠️ 請替換為你的 Google Apps Script 部署網址
    endpoint: '請填入 GAS 部署網址'
    
    // 範例：
    // endpoint: 'https://script.google.com/macros/s/AKfycbxxx.../exec'
};

// 檢查配置
if (API_CONFIG.endpoint === '請填入 GAS 部署網址') {
    console.warn('⚠️ API_CONFIG.endpoint 尚未設定！請參考 BACKEND_SETUP.md 完成設定。');
}
