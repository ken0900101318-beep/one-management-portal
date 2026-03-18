/**
 * ONE桌遊管理系統 - API 工具函式
 * 處理與 Google Apps Script 後端的所有通訊
 */

const API = {
    /**
     * 發送請求到後端
     */
    async request(action, data = {}) {
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: action,
                    ...data
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('API 請求失敗:', error);
            throw error;
        }
    },
    
    /**
     * 登入驗證
     * @param {string} username - 帳號
     * @param {string} password - 密碼
     * @returns {Promise<{success: boolean, user?: object, error?: string}>}
     */
    async login(username, password) {
        return await this.request('login', { username, password });
    },
    
    /**
     * 取得所有員工（不含密碼）
     * @returns {Promise<{success: boolean, users?: array, error?: string}>}
     */
    async getUsers() {
        return await this.request('getUsers');
    },
    
    /**
     * 新增員工
     * @param {object} user - 員工資料
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    async addUser(user) {
        return await this.request('addUser', { user });
    },
    
    /**
     * 更新員工資料
     * @param {string} userId - 員工 ID
     * @param {object} user - 更新的資料
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    async updateUser(userId, user) {
        return await this.request('updateUser', { userId, user });
    },
    
    /**
     * 刪除員工
     * @param {string} userId - 員工 ID
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    async deleteUser(userId) {
        return await this.request('deleteUser', { userId });
    }
};
