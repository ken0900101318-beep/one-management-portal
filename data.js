// ONE桌遊管理系統 - 共用帳號數據

function initializeData() {
    const hasUsers = localStorage.getItem('oneUsers');
    
    if (hasUsers) {
        console.log('✅ 帳號數據已存在');
        return;
    }
    
    console.log('🔄 初始化帳號數據...');
    
    const users = [
        { id: 'U001', username: 'admin', name: '阿建', role: 'admin', password: 'zxc88888', avatar: '👨‍💼' },
        { id: 'U002', username: 'jo', name: '建佑', role: 'admin', password: '123456', avatar: '👨‍💼' },
        { id: 'U003', username: 'staff1', name: '小圓', role: 'staff', password: '123456', avatar: '👩‍💻' },
        { id: 'U004', username: 'staff2', name: '尼克', role: 'staff', password: '123456', avatar: '👨‍💻' },
        { id: 'U005', username: 'acc', name: '會計', role: 'viewer', password: '123456', avatar: '👩‍💼' }
    ];
    
    localStorage.setItem('oneUsers', JSON.stringify(users));
    
    // 同步到報價系統（向下相容）
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('✅ 帳號數據初始化完成');
}

// 自動初始化
if (typeof window !== 'undefined') {
    initializeData();
}
