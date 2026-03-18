/**
 * ONE桌遊管理系統 - API 工具函式
 * 處理與 Google Apps Script 後端的所有通訊
 */

const API = {
    /**
     * 發送請求到後端（使用 GET 避免 CORS）
     */
    async request(action, data = {}) {
        try {
            // 建立查詢參數
            const params = new URLSearchParams({
                action: action,
                ...this.flattenData(data)
            });
            
            const url = `${API_CONFIG.endpoint}?${params.toString()}`;
            console.log('API 請求:', action, data);
            
            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow'
            });
            
            const text = await response.text();
            
            try {
                const result = JSON.parse(text);
                console.log('API 回應:', result);
                return result;
            } catch (e) {
                console.error('無法解析回應:', text);
                throw new Error('API 回應格式錯誤');
            }
            
        } catch (error) {
            console.error('API 請求失敗:', error);
            throw error;
        }
    },
    
    /**
     * 扁平化資料（將物件轉為查詢參數）
     */
    flattenData(data) {
        const flat = {};
        for (const key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                // 物件轉 JSON 字串
                flat[key] = JSON.stringify(data[key]);
            } else {
                flat[key] = data[key];
            }
        }
        return flat;
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
