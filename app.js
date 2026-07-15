document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       АККОРДЕОН FAQ
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    function setToggleIcon(item, isActive) {
        const btn = item.querySelector('.faq-toggle');
        if (!btn) return;
        btn.innerHTML = isActive
            ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L12 2M12 2H4M12 2V10" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 12H4M12 12V4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    faqItems.forEach(item => {
        setToggleIcon(item, item.classList.contains('active'));

        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isNowActive = !item.classList.contains('active');
            const col = item.closest('.faq-col');
            if (col) {
                col.querySelectorAll('.faq-item').forEach(sibling => {
                    if (sibling !== item) {
                        sibling.classList.remove('active');
                        setToggleIcon(sibling, false);
                    }
                });
            }
            item.classList.toggle('active', isNowActive);
            setToggleIcon(item, isNowActive);
        });
    });

    /* ==========================================================================
       ТАБЫ КЕЙСОВ
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    /* ==========================================================================
       МАСКА ТЕЛЕФОНА
       ========================================================================== */
    const phoneInputs = document.querySelectorAll('.phone-mask');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        });
    });

    /* ==========================================================================
       СЛАЙДЕР И ФИЛЬТРЫ КАТАЛОГА
       ========================================================================== */
    const catalogTabs = document.querySelectorAll('.catalog-tab');
    const catalogTrack = document.getElementById('catalogSliderTrack');
    const catalogCards = Array.from(catalogTrack.querySelectorAll('.catalog-card'));
    const prevBtn = document.querySelector('.catalog-arrow.prev');
    const nextBtn = document.querySelector('.catalog-arrow.next');
    const dotsContainer = document.getElementById('catalogSliderDots');
    
    let activeCategory = 'okna';
    let currentIndex = 0;
    let visibleCards = [];
    
    function getSlidesPerPage() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 3;
        return 4;
    }
    
    function updateSlider() {
        const slidesPerPage = getSlidesPerPage();
        const cardWidth = visibleCards[0] ? visibleCards[0].offsetWidth : 330;
        const gap = 20;
        
        const wrapperWidth = catalogTrack.parentElement.offsetWidth;
        const totalCardsWidth = visibleCards.length * cardWidth + (Math.max(0, visibleCards.length - 1) * gap);
        const needsSliding = totalCardsWidth > wrapperWidth;
        
        const maxIndex = needsSliding ? Math.max(0, visibleCards.length - slidesPerPage) : 0;
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;
        
        if (needsSliding) {
            const offset = -currentIndex * (cardWidth + gap);
            catalogTrack.style.transform = `translateX(${offset}px)`;
        } else {
            catalogTrack.style.transform = 'none';
        }
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
        
        visibleCards.forEach((card, index) => {
            if (needsSliding && slidesPerPage >= 3 && (index === currentIndex || index === currentIndex + slidesPerPage - 1)) {
                card.classList.add('faded');
            } else {
                card.classList.remove('faded');
            }
        });
        
        const dots = dotsContainer.querySelectorAll('.catalog-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function filterProducts(category) {
        activeCategory = category;
        currentIndex = 0;
        
        visibleCards = catalogCards.filter(card => {
            const cat = card.getAttribute('data-cat');
            if (cat === category) {
                card.style.display = 'flex';
                return true;
            } else {
                card.style.display = 'none';
                return false;
            }
        });
        
        updateSliderLayout();
    }

    function updateSliderLayout() {
        const slidesPerPage = getSlidesPerPage();
        const cardWidth = visibleCards[0] ? visibleCards[0].offsetWidth : 330;
        const gap = 20;
        
        const wrapperWidth = catalogTrack.parentElement.offsetWidth;
        const totalCardsWidth = visibleCards.length * cardWidth + (Math.max(0, visibleCards.length - 1) * gap);
        const needsSliding = totalCardsWidth > wrapperWidth;
        
        if (needsSliding) {
            catalogTrack.classList.remove('centered');
        } else {
            catalogTrack.classList.add('centered');
        }
        
        dotsContainer.innerHTML = '';
        
        if (needsSliding) {
            const maxIndex = Math.max(0, visibleCards.length - slidesPerPage);
            if (maxIndex > 0) {
                for (let i = 0; i <= maxIndex; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('catalog-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateSlider();
                    });
                    dotsContainer.appendChild(dot);
                }
                dotsContainer.style.display = 'flex';
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            } else {
                dotsContainer.style.display = 'none';
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        } else {
            dotsContainer.style.display = 'none';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        updateSlider();
    }
    
    catalogTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catalogTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterProducts(tab.getAttribute('data-cat'));
        });
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const slidesPerPage = getSlidesPerPage();
        if (currentIndex < visibleCards.length - slidesPerPage) {
            currentIndex++;
            updateSlider();
        }
    });
    
    window.addEventListener('resize', () => {
        filterProducts(activeCategory);
        updateReviewsSlider();
        updateCasesSlider();
    });
    
    /* ==========================================================================
       СЛАЙДЕР ОТЗЫВОВ
       ========================================================================== */
    const reviewsTrack = document.getElementById('reviewsSliderTrack');
    const reviewsCards = Array.from(reviewsTrack.querySelectorAll('.review-card'));
    const reviewsDotsContainer = document.getElementById('reviewsSliderDots');
    
    let reviewIndex = 2; // Владимир Соколов (индекс 2) по умолчанию в центре
    
    function updateReviewsSlider() {
        if (reviewsCards.length === 0) return;
        
        const wrapper = reviewsTrack.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        const cardWidth = reviewsCards[0].offsetWidth;
        const gap = 22;
        
        const offset = (wrapperWidth / 2) - (cardWidth / 2) - reviewIndex * (cardWidth + gap);
        reviewsTrack.style.transform = `translateX(${offset}px)`;
        
        reviewsCards.forEach((card, idx) => {
            if (idx === reviewIndex) {
                card.classList.add('active');
                card.classList.remove('faded');
            } else {
                card.classList.remove('active');
                card.classList.add('faded');
            }
        });
        
        const dots = reviewsDotsContainer.querySelectorAll('.reviews-dot');
        dots.forEach((dot, idx) => {
            if (idx === reviewIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function initReviewsSlider() {
        reviewsDotsContainer.innerHTML = '';
        reviewsCards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('reviews-dot');
            if (idx === reviewIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                reviewIndex = idx;
                updateReviewsSlider();
            });
            reviewsDotsContainer.appendChild(dot);
        });
        updateReviewsSlider();
    }

    /* ==========================================================================
       СЛАЙДЕР КЕЙСОВ И ФИЛЬТРЫ
       ========================================================================== */
    const casesTrack = document.getElementById('casesSliderTrack');
    const casesCards = Array.from(casesTrack.querySelectorAll('.case-card'));
    const casesDotsContainer = document.getElementById('casesSliderDots');
    const casesPrevBtn = document.querySelector('.cases-arrow.prev');
    const casesNextBtn = document.querySelector('.cases-arrow.next');
    const casesTabBtns = document.querySelectorAll('.cases-tabs .tab-btn');
    
    let activeCaseCategory = 'balcony';
    let filteredCases = [];
    let caseIndex = 0;
    
    function filterCases(category) {
        activeCaseCategory = category;
        
        casesTabBtns.forEach(btn => {
            if (btn.getAttribute('data-cat') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        filteredCases = casesCards.filter(card => {
            const matches = card.getAttribute('data-cat') === category;
            if (matches) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
            return matches;
        });
        
        caseIndex = 0;
        renderCasesDots();
        updateCasesSlider();
    }
    
    function updateCasesSlider() {
        if (filteredCases.length === 0) return;
        
        const wrapper = casesTrack.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        const cardWidth = filteredCases[0].offsetWidth;
        const gap = 40;
        
        const offset = (wrapperWidth / 2) - (cardWidth / 2) - caseIndex * (cardWidth + gap);
        casesTrack.style.transform = `translateX(${offset}px)`;
        
        filteredCases.forEach((card, idx) => {
            if (idx === caseIndex) {
                card.classList.add('active');
                card.classList.remove('faded');
            } else {
                card.classList.remove('active');
                card.classList.add('faded');
            }
        });
        
        const dots = casesDotsContainer.querySelectorAll('.cases-dot');
        dots.forEach((dot, idx) => {
            if (idx === caseIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function renderCasesDots() {
        casesDotsContainer.innerHTML = '';
        filteredCases.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('cases-dot');
            if (idx === caseIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                caseIndex = idx;
                updateCasesSlider();
            });
            casesDotsContainer.appendChild(dot);
        });
    }
    
    casesTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterCases(btn.getAttribute('data-cat'));
        });
    });
    
    casesPrevBtn.addEventListener('click', () => {
        if (caseIndex > 0) {
            caseIndex--;
            updateCasesSlider();
        }
    });
    
    casesNextBtn.addEventListener('click', () => {
        if (caseIndex < filteredCases.length - 1) {
            caseIndex++;
            updateCasesSlider();
        }
    });

    window.updateCasesSlider = updateCasesSlider;

    /* ==========================================================================
       ИНИЦИАЛИЗАЦИЯ
       ========================================================================== */
    filterProducts('okna');
    initReviewsSlider();
    filterCases('balcony');

    /* ==========================================================================
       ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ
       ========================================================================== */
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            const burger = document.querySelector('.burger');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});

/* ==========================================================================
   ПЕРЕКЛЮЧЕНИЕ ИЗОБРАЖЕНИЙ В КЕЙСАХ
   ========================================================================== */
function changeCaseImage(thumb, imgId) {
    const mainImg = document.getElementById(imgId);
    if (mainImg) {
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt;
        
        const siblings = thumb.parentElement.querySelectorAll('.case-thumb');
        siblings.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    }
}

/* ==========================================================================
   МОДАЛЬНЫЕ ОКНА
   ========================================================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Закрытие модалок при клике на оверлей
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* ==========================================================================
   МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
   ========================================================================== */
function toggleMenu() {
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.burger');
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}
