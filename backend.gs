/**
 * ONE桌遊管理系統 - 員工資料中央化儲存
 * Google Apps Script 後端
 */

// Google Sheets ID
const SHEET_ID = '1VAn00P6UwTd95cC-UCtQcJcHLIFhSzC9b_2q-hHE_NQ';
const SHEET_NAME = '員工資料';

/**
 * 初始化 Google Sheets
 */
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // 設定標題列
    sheet.appendRow(['ID', '頭像', '姓名', '帳號', '密碼', '權限', '建立時間', '更新時間']);
    
    // 初始化員工資料
    const users = [
      ['USR-JIANYOU', '👨‍💼', '建佑', '0920119696', '789456', 'admin', new Date(), new Date()],
      ['USR-ACCOUNTING', '💼', '會計', '0919759368', '4920r035', 'viewer', new Date(), new Date()],
      ['USR-XIAOYUAN', '👨', '小圓', '0966428064', '666666', 'admin', new Date(), new Date()],
      ['USR-NICK', '🧑', '尼克', 'willy5407', '666666', 'staff', new Date(), new Date()]
    ];
    
    users.forEach(user => sheet.appendRow(user));
  }
  
  return sheet;
}

/**
 * 處理 API 請求（POST）
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    let result;
    switch (action) {
      case 'login':
        result = handleLogin(params.username, params.password);
        break;
      case 'getUsers':
        result = handleGetUsers();
        break;
      case 'addUser':
        result = handleAddUser(params.user);
        break;
      case 'updateUser':
        result = handleUpdateUser(params.userId, params.user);
        break;
      case 'deleteUser':
        result = handleDeleteUser(params.userId);
        break;
      default:
        result = { success: false, error: '未知操作' };
    }
    
    // 允許 CORS
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理 GET 請求（用於測試 + 讀取操作）
 */
function doGet(e) {
  const action = e.parameter.action || 'test';
  
  if (action === 'test') {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'ONE桌遊員工管理系統 API 正常運作',
        timestamp: new Date()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 登入驗證（支援 GET，方便前端 CORS）
  if (action === 'login') {
    const result = handleLogin(e.parameter.username, e.parameter.password);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 新增員工
  if (action === 'addUser' && e.parameter.user) {
    const user = JSON.parse(e.parameter.user);
    const result = handleAddUser(user);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 更新員工
  if (action === 'updateUser' && e.parameter.userId && e.parameter.user) {
    const user = JSON.parse(e.parameter.user);
    const result = handleUpdateUser(e.parameter.userId, user);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 刪除員工
  if (action === 'deleteUser' && e.parameter.userId) {
    const result = handleDeleteUser(e.parameter.userId);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 取得員工列表
  if (action === 'getUsers') {
    const result = handleGetUsers();
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: '不支援的操作'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 登入驗證
 */
function handleLogin(username, password) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // 跳過標題列
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[3] === username && row[4] === password) {
      return {
        success: true,
        user: {
          id: row[0],
          avatar: row[1],
          name: row[2],
          username: row[3],
          role: row[5]
        }
      };
    }
  }
  
  return {
    success: false,
    error: '帳號或密碼錯誤'
  };
}

/**
 * 取得所有員工（不含密碼）
 */
function handleGetUsers() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  const users = [];
  // 跳過標題列
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    users.push({
      id: row[0],
      avatar: row[1],
      name: row[2],
      username: row[3],
      role: row[5],
      createdAt: row[6],
      updatedAt: row[7]
    });
  }
  
  return {
    success: true,
    users: users
  };
}

/**
 * 新增員工
 */
function handleAddUser(user) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // 檢查帳號是否已存在
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === user.username) {
      return {
        success: false,
        error: '此帳號已存在'
      };
    }
  }
  
  // 新增員工
  const newRow = [
    user.id || 'USR-' + Date.now(),
    user.avatar,
    user.name,
    user.username,
    user.password,
    user.role,
    new Date(),
    new Date()
  ];
  
  sheet.appendRow(newRow);
  
  return {
    success: true,
    message: '員工已新增'
  };
}

/**
 * 更新員工資料
 */
function handleUpdateUser(userId, user) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // 尋找要更新的列
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      // 更新資料（保留 ID 和建立時間）
      sheet.getRange(i + 1, 2).setValue(user.avatar);
      sheet.getRange(i + 1, 3).setValue(user.name);
      sheet.getRange(i + 1, 4).setValue(user.username);
      if (user.password) {
        sheet.getRange(i + 1, 5).setValue(user.password);
      }
      sheet.getRange(i + 1, 6).setValue(user.role);
      sheet.getRange(i + 1, 8).setValue(new Date()); // 更新時間
      
      return {
        success: true,
        message: '員工資料已更新'
      };
    }
  }
  
  return {
    success: false,
    error: '找不到該員工'
  };
}

/**
 * 刪除員工
 */
function handleDeleteUser(userId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // 尋找要刪除的列
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.deleteRow(i + 1);
      return {
        success: true,
        message: '員工已刪除'
      };
    }
  }
  
  return {
    success: false,
    error: '找不到該員工'
  };
}
