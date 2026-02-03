// 活动详情页交互逻辑

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的活动ID
    const activityId = getActivityIdFromUrl();
    
    // 根据活动ID加载活动数据
    loadActivityData(activityId);
    
    // 初始化审核按钮事件
    initApprovalButtons();
});

// 从URL参数中获取活动ID
function getActivityIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '123466'; // 默认ID
}

// 根据活动ID加载活动数据
function loadActivityData(activityId) {
    // 这里可以添加调用API的逻辑
    console.log(`加载活动ID为 ${activityId} 的数据`);
    
    // 模拟API请求延迟
    setTimeout(function() {
        // 更新页面标题显示活动ID
        const pageTitle = document.querySelector('.page-header-with-status h1');
        if (pageTitle) {
            pageTitle.textContent = `活动详情 - ID: ${activityId}`;
        }
        
        // 这里可以添加根据活动ID更新页面数据的逻辑
        // 目前使用静态数据，后续可扩展为从API获取数据
    }, 300);
}

// 初始化审核按钮事件
function initApprovalButtons() {
    // 获取审核按钮
    const approveBtn = document.querySelector('.approve-btn');
    const rejectBtn = document.querySelector('.reject-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    // 审核通过按钮事件
    if (approveBtn) {
        approveBtn.addEventListener('click', function() {
            // 显示确认对话框
            if (confirm('确定要通过该活动的审核吗？')) {
                // 执行审核通过操作
                performApproval('approved');
            }
        });
    }
    
    // 拒绝按钮事件
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            // 显示确认对话框
            if (confirm('确定要拒绝该活动的审核吗？')) {
                // 执行拒绝操作
                performApproval('rejected');
            }
        });
    }
    
    // 取消按钮事件
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // 返回列表页面
            goBackToList();
        });
    }
}

// 执行审核操作
function performApproval(status) {
    // 这里可以添加调用API的逻辑
    console.log(`活动审核${status === 'approved' ? '通过' : '拒绝'}`);
    
    // 模拟API请求延迟
    setTimeout(function() {
        // 显示操作结果
        showNotification(`活动审核${status === 'approved' ? '通过' : '拒绝'}成功！`, 'success');
        
        // 延迟返回列表页面
        setTimeout(function() {
            goBackToList();
        }, 1000);
    }, 500);
}

// 返回列表页面
function goBackToList() {
    // 返回医学播客页面
    window.location.href = 'medical-podcast.html';
}

// 显示通知（复用现有函数）
function showNotification(message, type = 'info', duration = 3000) {
    // 检查是否已有showNotification函数
    if (window.showNotification) {
        // 如果已有，使用现有函数
        window.showNotification(message, type, duration);
    } else {
        // 如果没有，创建一个简单的通知
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            background-color: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : type === 'warning' ? '#fbbf24' : '#667eea'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-size: 0.9rem;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 自动移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// 添加动画样式（如果不存在）
if (!document.querySelector('style[data-notification-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notification-animations', 'true');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
