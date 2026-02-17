/* ========== 深色主题初始化 ========== */

class ThemeSwitcher {
  constructor() {
    this.currentTheme = 'dark';
    this.init();
  }

  init() {
    this.applyTheme('dark');
  }

  applyTheme(theme) {
    // 设置深色主题
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    document.documentElement.style.setProperty('--theme-bg', '#0f0f0f');
    document.documentElement.style.setProperty('--theme-text', '#f0f0f0');
    document.documentElement.style.setProperty('--theme-card', 'rgba(26, 26, 26, 0.8)');
    document.documentElement.style.setProperty('--theme-border', 'rgba(255, 255, 255, 0.08)');
  }
}

// 页面加载时初始化深色主题
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
});

// 如果DOM已加载，立即初始化
if (document.readyState !== 'loading') {
  new ThemeSwitcher();
}
