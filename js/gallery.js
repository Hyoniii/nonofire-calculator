/**
 * 노노파이어 커튼 갤러리
 * 이미지 동적 로드 및 필터링
 */

// ===== 이미지 설정 관리 =====
const ImageManager = {
    config: null,
    placeholder: 'https://placehold.co/400x300/8B7355/FFFFFF?text=NONOFIRE',

    // 설정 로드
    async loadConfig() {
        try {
            const response = await fetch('data/images.json');
            if (!response.ok) throw new Error('이미지 설정 로드 실패');
            this.config = await response.json();
            this.placeholder = this.config.placeholder || this.placeholder;
            return this.config;
        } catch (error) {
            console.warn('이미지 설정을 로드할 수 없습니다. 기본값을 사용합니다.', error);
            this.config = this.getDefaultConfig();
            return this.config;
        }
    },

    // 기본 설정 (JSON 로드 실패 시)
    getDefaultConfig() {
        return {
            hero: {
                main: {
                    src: this.placeholder,
                    alt: '노노파이어 커튼 메인 이미지',
                    title: '노노파이어 커튼'
                }
            },
            gallery: [
                {
                    id: 'img1',
                    src: 'https://placehold.co/400x300/8B7355/FFFFFF?text=나비주름+2배',
                    alt: '나비주름 2배 커튼',
                    category: '나비주름',
                    title: '나비주름 2배'
                },
                {
                    id: 'img2',
                    src: 'https://placehold.co/400x300/A69076/FFFFFF?text=나비주름+2.5배',
                    alt: '나비주름 2.5배 커튼',
                    category: '나비주름',
                    title: '나비주름 2.5배'
                },
                {
                    id: 'img3',
                    src: 'https://placehold.co/400x300/C4A77D/333333?text=나비주름+3배',
                    alt: '나비주름 3배 커튼',
                    category: '나비주름',
                    title: '나비주름 3배'
                },
                {
                    id: 'img4',
                    src: 'https://placehold.co/400x300/5D4E37/FFFFFF?text=맞주름+2배',
                    alt: '맞주름 커튼',
                    category: '맞주름',
                    title: '맞주름 2배'
                },
                {
                    id: 'img5',
                    src: 'https://placehold.co/400x300/8B7355/FFFFFF?text=뒷맞주름+2.5배',
                    alt: '뒷맞주름 커튼',
                    category: '뒷맞주름',
                    title: '뒷맞주름 2.5배'
                },
                {
                    id: 'img6',
                    src: 'https://placehold.co/400x300/A69076/FFFFFF?text=민자주름+1.5배',
                    alt: '민자주름 커튼',
                    category: '민자주름',
                    title: '민자주름 1.5배'
                }
            ],
            placeholder: 'https://placehold.co/400x300/8B7355/FFFFFF?text=NONOFIRE'
        };
    },

    // 이미지 URL 가져오기 (존재하지 않으면 placeholder 반환)
    getImageUrl(src) {
        if (!src || src === '') {
            return this.placeholder;
        }
        return src;
    },

    // 히어로 이미지 설정
    setHeroImage(imgElement) {
        if (this.config && this.config.hero && this.config.hero.main) {
            imgElement.src = this.getImageUrl(this.config.hero.main.src);
            imgElement.alt = this.config.hero.main.alt || '노노파이어 커튼';
        }
    },

    // 갤러리 이미지 목록
    getGalleryImages() {
        return this.config?.gallery || [];
    }
};

// ===== 갤러리 =====
const Gallery = {
    container: null,
    filterButtons: null,
    currentFilter: 'all',

    init() {
        this.container = document.getElementById('galleryGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.setupFilters();
    },

    setupFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 버튼 상태 변경
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 필터 적용
                this.currentFilter = btn.dataset.filter;
                this.render();
            });
        });
    },

    render() {
        const images = ImageManager.getGalleryImages();
        const filteredImages = this.currentFilter === 'all'
            ? images
            : images.filter(img => img.category === this.currentFilter);

        this.container.innerHTML = '';

        filteredImages.forEach(img => {
            const item = this.createGalleryItem(img);
            this.container.appendChild(item);
        });

        // 애니메이션 효과
        requestAnimationFrame(() => {
            this.container.querySelectorAll('.gallery-item').forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            });
        });
    },

    createGalleryItem(img) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.category = img.category;

        const imgEl = document.createElement('img');
        imgEl.src = ImageManager.getImageUrl(img.src);
        imgEl.alt = img.alt;
        imgEl.loading = 'lazy';

        // 이미지 로드 실패 시 placeholder 사용
        imgEl.onerror = () => {
            imgEl.src = ImageManager.placeholder;
        };

        const info = document.createElement('div');
        info.className = 'gallery-item-info';

        const category = document.createElement('span');
        category.className = 'gallery-item-category';
        category.textContent = img.category;

        const title = document.createElement('h4');
        title.className = 'gallery-item-title';
        title.textContent = img.title;

        info.appendChild(category);
        info.appendChild(title);
        item.appendChild(imgEl);
        item.appendChild(info);

        return item;
    }
};

// ===== 히어로 이미지 =====
const Hero = {
    container: null,

    init() {
        this.container = document.getElementById('heroImage');
    },

    render() {
        const img = this.container.querySelector('img');
        if (img) {
            ImageManager.setHeroImage(img);

            // 이미지 로드 실패 시 placeholder 사용
            img.onerror = () => {
                img.src = ImageManager.placeholder + '?text=NONOFIRE+CURTAIN';
            };
        }
    }
};

// ===== 초기화 =====
async function initGallery() {
    await ImageManager.loadConfig();

    Hero.init();
    Hero.render();

    Gallery.init();
    Gallery.render();
}

document.addEventListener('DOMContentLoaded', initGallery);
