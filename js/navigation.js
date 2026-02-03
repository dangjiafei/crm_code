// 导航交互模块
// 负责处理顶部导航和左侧菜单的交互逻辑

// 组件加载逻辑
async function loadComponents() {
    // 先清空占位符，避免内容叠加
    document.getElementById('header-placeholder').innerHTML = '';
    document.getElementById('sidebar-placeholder').innerHTML = '';
    
    // 加载顶部导航栏
    try {
        const headerResponse = await fetch('components/header.html');
        const headerContent = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerContent;
    } catch (error) {
        console.error('Failed to load header component:', error);
    }
    
    // 加载左侧侧边栏
    try {
        const sidebarResponse = await fetch('components/sidebar.html');
        const sidebarContent = await sidebarResponse.text();
        document.getElementById('sidebar-placeholder').innerHTML = sidebarContent;
        
        // 组件加载完成后，立即隐藏所有左侧菜单项，避免菜单闪现
        const sidebarNavItems = document.querySelectorAll('.sidebar-nav > .nav-item');
        sidebarNavItems.forEach(item => {
            item.style.display = 'none';
        });
    } catch (error) {
        console.error('Failed to load sidebar component:', error);
    }
}

// 导航交互逻辑
function initNavigationInteraction() {
    // 先获取当前页面URL
    const currentPath = window.location.pathname;
    
    // 优先检查专家管理相关页面
    let activeModule = 'workbench'; // 默认激活工作台
    
    // 明确的URL检查，确保专家管理页面被正确识别为customer模块
    if (currentPath.includes('/expert-') || currentPath.includes('/customer-')) {
        activeModule = 'customer';
    } else if (currentPath.includes('expert-management') || currentPath.includes('expert-detail')) {
        activeModule = 'customer';
    } else if (currentPath.includes('medical-podcast') || currentPath.includes('activity') || currentPath.includes('interactive-case') || currentPath.includes('case-review-detail')) {
        activeModule = 'workbench';
    }
    
    // 先激活对应的顶部导航项
    const navMenuLinks = document.querySelectorAll('.nav-menu-link');
    navMenuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-module') === activeModule) {
            link.classList.add('active');
        }
    });
    
    // 初始化二级菜单切换
    initSubmenuToggles();
    
    // 初始化时根据确定的模块切换侧边栏菜单
    switchSidebarByModule(activeModule);
    
    // 顶部导航栏点击事件
    navMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有导航项的激活状态
            navMenuLinks.forEach(l => l.classList.remove('active'));
            // 添加当前导航项的激活状态
            link.classList.add('active');
            
            // 获取当前点击的模块
            const module = link.getAttribute('data-module');
            // 切换左侧菜单
            switchSidebarByModule(module);
        });
    });
    
    // 最后检查如果是活动相关页面，确保活动管理菜单展开
    if (currentPath.includes('medical-podcast') || currentPath.includes('activity') || currentPath.includes('interactive-case') || currentPath.includes('case-review-detail')) {
        const activityMenu = document.querySelector('.nav-item.has-submenu');
        if (activityMenu) {
            activityMenu.classList.add('active');
            
            // 设置对应的二级菜单项为活跃状态
            const subNavItems = activityMenu.querySelectorAll('.submenu > .nav-item');
            subNavItems.forEach(item => {
                item.classList.remove('active');
                
                // 获取二级菜单项的文本内容
                const subMenuItem = item.querySelector('.nav-link-sub');
                if (subMenuItem) {
                    // 根据当前URL设置对应的二级菜单项为活跃状态
                    if ((currentPath.includes('medical-podcast') || currentPath.includes('activity-detail')) && subMenuItem.textContent.includes('医学播客')) {
                        item.classList.add('active');
                    } else if ((currentPath.includes('interactive-case') || currentPath.includes('case-review-detail')) && subMenuItem.textContent.includes('在线病例互动')) {
                        item.classList.add('active');
                    }
                }
            });
        }
    }
    
    // 检查如果是专家管理相关页面，确保专家管理菜单项被选中
    if (currentPath.includes('expert-management')) {
        // 找到专家管理菜单项并添加active类
        const expertManagementItem = document.querySelector('.sidebar-nav .nav-item a[data-module="customer"][href="expert-management.html"]');
        if (expertManagementItem) {
            // 移除所有左侧菜单的激活状态
            const allSidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
            allSidebarNavItems.forEach(item => {
                item.classList.remove('active');
            });
            // 添加当前菜单项的激活状态
            const parentItem = expertManagementItem.closest('.nav-item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        }
    } else if (currentPath.includes('expert-invite') || currentPath.includes('expert-detail')) {
        // 专家邀约和专家详情页面也显示专家管理为选中状态
        const expertManagementItem = document.querySelector('.sidebar-nav .nav-item a[data-module="customer"][href="expert-management.html"]');
        if (expertManagementItem) {
            // 移除所有左侧菜单的激活状态
            const allSidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
            allSidebarNavItems.forEach(item => {
                item.classList.remove('active');
            });
            // 添加当前菜单项的激活状态
            const parentItem = expertManagementItem.closest('.nav-item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        }
    }
}

// 初始化二级菜单切换
function initSubmenuToggles() {
    // 为所有submenu-toggle添加点击事件监听器
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        // 移除可能存在的旧事件监听器
        toggle.removeEventListener('click', toggleSubmenu);
        // 添加新的事件监听器
        toggle.addEventListener('click', toggleSubmenu);
    });
}

// 二级菜单切换函数
function toggleSubmenu(e) {
    e.stopPropagation();
    
    // 获取当前导航项（必须是带has-submenu类的元素）
    const navItem = this.closest('.nav-item.has-submenu');
    if (navItem) {
        // 只切换has-submenu元素的active类，CSS会自动处理submenu的显示/隐藏
        navItem.classList.toggle('active');
    }
}

// 根据模块切换左侧菜单
function switchSidebarByModule(module) {
    // 获取所有左侧菜单导航项 - 只处理直接子项（一级菜单）
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav > .nav-item');
    
    // 遍历所有一级菜单项，根据模块显示或隐藏
    sidebarNavItems.forEach(item => {
        const itemModule = item.getAttribute('data-module');
        
        // 当模块是workbench时，只显示workbench模块的菜单项
        // 当模块是customer时，只显示customer模块的菜单项
        if (itemModule === module) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
            // 确保非当前模块的子菜单收起
            if (item.classList.contains('has-submenu')) {
                item.classList.remove('active');
            }
        }
    });
}

// 导出函数，以便其他脚本使用
window.loadComponents = loadComponents;
window.initNavigationInteraction = initNavigationInteraction;
window.initSubmenuToggles = initSubmenuToggles;
window.toggleSubmenu = toggleSubmenu;
window.switchSidebarByModule = switchSidebarByModule;