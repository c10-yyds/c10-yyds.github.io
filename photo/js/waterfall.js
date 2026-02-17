/* ========== 瀑布流照片展示 - JavaScript ========== */

class WaterfallGallery {
  constructor(options = {}) {
    this.container = document.querySelector(options.containerId || '.waterfall-grid');
    this.photos = options.photos || [];
    this.currentIndex = 0;
    this.lazyLoadObserver = null;
    this.modalOverlay = document.querySelector('.modal-overlay');
    this.modalImage = document.querySelector('.modal-image');
    this.modalCounter = document.querySelector('.modal-counter');

    if (!this.container) {
      console.error('未找到瀑布流容器');
      return;
    }

    this.init();
  }

  init() {
    // 生成图片 HTML
    this.renderPhotos();

    // 初始化事件监听
    this.setupEventListeners();

    // 初始化懒加载
    this.setupLazyLoad();
  }

  renderPhotos() {
    this.container.innerHTML = '';

    this.photos.forEach((photo, index) => {
      const item = document.createElement('div');
      item.className = 'photo-item loading';
      item.dataset.index = index;

      const img = document.createElement('img');
      img.dataset.src = photo.src;
      img.alt = photo.alt || '瀑布流图片';
      img.setAttribute('data-index', index);

      item.appendChild(img);
      this.container.appendChild(item);
    });
  }

  setupLazyLoad() {
    // 使用 Intersection Observer API 实现懒加载
    const observerOptions = {
      root: null,
      rootMargin: '50px', // 提前 50px 开始加载
      threshold: 0.01
    };

    this.lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;

          if (src && !img.src) {
            img.src = src;
            img.onload = () => {
              img.classList.add('loaded');
              img.parentElement.classList.remove('loading');
            };
            img.onerror = () => {
              img.classList.add('loaded');
              img.parentElement.classList.remove('loading');
              console.error('图片加载失败:', src);
            };

            this.lazyLoadObserver.unobserve(img);
          }
        }
      });
    }, observerOptions);

    // 观察所有图片
    document.querySelectorAll('.photo-item img').forEach(img => {
      this.lazyLoadObserver.observe(img);
    });
  }

  setupEventListeners() {
    // 点击图片打开模态框
    this.container.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        this.currentIndex = parseInt(e.target.dataset.index);
        this.openModal();
      }
    });

    // 模态框控件
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    const overlay = document.querySelector('.modal-overlay');

    closeBtn?.addEventListener('click', () => this.closeModal());
    prevBtn?.addEventListener('click', () => this.prevImage());
    nextBtn?.addEventListener('click', () => this.nextImage());

    // 点击背景关闭
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      if (!this.modalOverlay.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
  }

  openModal() {
    this.modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    this.displayImage(this.currentIndex);
  }

  closeModal() {
    this.modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  displayImage(index) {
    if (index < 0 || index >= this.photos.length) return;

    const photo = this.photos[index];
    this.modalImage.src = photo.src;
    this.modalImage.alt = photo.alt || '瀑布流图片';

    // 更新计数器
    if (this.modalCounter) {
      this.modalCounter.textContent = `${index + 1} / ${this.photos.length}`;
    }

    this.currentIndex = index;
  }

  prevImage() {
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.photos.length - 1; // 循环到最后
    }
    this.displayImage(prevIndex);
  }

  nextImage() {
    let nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.photos.length) {
      nextIndex = 0; // 循环到开头
    }
    this.displayImage(nextIndex);
  }

  // 动态添加新图片
  addPhotos(newPhotos) {
    this.photos = this.photos.concat(newPhotos);
    this.renderPhotos();
    this.setupLazyLoad();
  }

  // 更新统计信息
  updateStats(total) {
    const statsEl = document.querySelector('.waterfall-stats');
    if (statsEl) {
      statsEl.textContent = `共 ${total} 张照片`;
    }
  }
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否是照片页面
  const photoGrid = document.querySelector('.waterfall-grid');
  if (photoGrid) {
    const photos = window.PHOTOS || [];
    if (photos.length > 0) {
      window.gallery = new WaterfallGallery({
        containerId: '.waterfall-grid',
        photos: photos
      });
      window.gallery.updateStats(photos.length);
    }
  }
});

// ========== 视频渲染函数 ==========
function renderVideos(videos) {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  videoGrid.innerHTML = '';
  videos.forEach((video) => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';

    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.preload = 'metadata';
    videoElement.playsinline = true;

    const source = document.createElement('source');
    source.src = video.src;
    source.type = 'video/mp4';

    videoElement.appendChild(source);
    videoCard.appendChild(videoElement);
    videoGrid.appendChild(videoCard);
  });
}

// ========== 工具函数：从文件夹路径生成图片配置 ==========
function generatePhotosFromFolder(folderPath, fileNames) {
  /**
   * 辅助函数：快速生成照片配置
   * @param {string} folderPath - 文件夹路径，如 './assets/photos/'
   * @param {array} fileNames - 文件名数组，如 ['1.jpg', '2.jpg']
   * @returns {array} 照片配置数组
   * 
   * 使用方式：
   * const photos = generatePhotosFromFolder('./assets/photos/', ['1.jpg', '2.jpg', '3.jpg']);
   */
  return fileNames.map((fileName, index) => ({
    src: folderPath + fileName,
    alt: `照片 ${index + 1}`
  }));
}
