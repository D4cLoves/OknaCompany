document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       СЛАЙДЕР ГЛАВНОГО БАННЕРА (HERO)
       ========================================================================== */
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroIndicatorsContainer = document.querySelector('.hero-slider-indicators');
    const heroTextBlock = document.querySelector('.hero-text-block');

    const heroSlidesData = [
        {
            title: "Производство и установка пластиковых окон",
            subtitle: "Скидки до 45% до конца месяца!"
        },
        {
            title: "Остекление и отделка балконов и лоджий",
            subtitle: "Теплые и холодные варианты под ключ."
        },
        {
            title: "Надежные входные и межкомнатные двери",
            subtitle: "Прочные конструкции напрямую от производителя."
        },
        {
            title: "Ремонт и обслуживание оконных конструкций",
            subtitle: "Быстрый выезд мастера и гарантия качества."
        }
    ];

    let currentHeroIndex = 0;
    let heroInterval;

    function showHeroSlide(index) {
        heroSlides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === index);
        });

        if (heroTextBlock && heroTitle && heroSubtitle) {
            heroTextBlock.style.opacity = '0';
            setTimeout(() => {
                heroTitle.textContent = heroSlidesData[index].title;
                heroSubtitle.textContent = heroSlidesData[index].subtitle;
                heroTextBlock.style.opacity = '1';
            }, 400);
        }

        updateHeroIndicators(index);
    }

    function updateHeroIndicators(activeIndex) {
        if (!heroIndicatorsContainer) return;
        heroIndicatorsContainer.innerHTML = '';
        for (let i = 0; i < heroSlidesData.length; i++) {
            const span = document.createElement('span');
            span.className = i === activeIndex ? 'indicator-line' : 'indicator-dot';
            span.addEventListener('click', () => {
                currentHeroIndex = i;
                showHeroSlide(i);
                resetHeroInterval();
            });
            heroIndicatorsContainer.appendChild(span);
        }
    }

    function startHeroInterval() {
        heroInterval = setInterval(() => {
            currentHeroIndex = (currentHeroIndex + 1) % heroSlidesData.length;
            showHeroSlide(currentHeroIndex);
        }, 6000);
    }

    function resetHeroInterval() {
        clearInterval(heroInterval);
        startHeroInterval();
    }

    if (heroSlides.length > 0) {
        updateHeroIndicators(0);
        startHeroInterval();
    }

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

    function getDefaultCatalogIndex() {
        const slidesPerPage = getSlidesPerPage();
        const maxIndex = Math.max(0, visibleCards.length - slidesPerPage);
        return Math.round(maxIndex / 2);
    }

    function updateSlider() {
        const slidesPerPage = getSlidesPerPage();
        const cardWidth = visibleCards[0] ? (visibleCards[0].offsetWidth || 340) : 340;
        const gap = 20;
        
        const needsSliding = visibleCards.length > slidesPerPage;
        
        const maxIndex = needsSliding ? Math.max(0, visibleCards.length - slidesPerPage) : 0;
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;
        
        if (needsSliding) {
            const offset = -currentIndex * (cardWidth + gap);
            catalogTrack.style.transform = `translateX(${offset}px)`;
        } else {
            catalogTrack.style.transform = 'none';
        }
        
        if (prevBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
        }
        
        visibleCards.forEach((card, index) => {
            if (needsSliding && slidesPerPage >= 3 && (index < currentIndex || index > currentIndex + slidesPerPage - 1)) {
                card.classList.add('faded');
            } else {
                card.classList.remove('faded');
            }
        });
        
        const dots = dotsContainer.querySelectorAll('span');
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.className = 'indicator-line';
            } else {
                dot.className = 'indicator-dot';
            }
        });
    }
    
    function filterProducts(category) {
        activeCategory = category;
        
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

        currentIndex = getDefaultCatalogIndex();
        
        updateSliderLayout();
    }

    function updateSliderLayout() {
        const slidesPerPage = getSlidesPerPage();
        const cardWidth = visibleCards[0] ? (visibleCards[0].offsetWidth || 340) : 340;
        const gap = 20;
        
        const needsSliding = visibleCards.length > slidesPerPage;
        
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
                    const dot = document.createElement('span');
                    dot.className = i === currentIndex ? 'indicator-line' : 'indicator-dot';
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateSlider();
                    });
                    dotsContainer.appendChild(dot);
                }
                dotsContainer.style.display = 'flex';
                if (prevBtn) prevBtn.style.display = 'flex';
                if (nextBtn) nextBtn.style.display = 'flex';
            } else {
                dotsContainer.style.display = 'none';
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            }
        } else {
            dotsContainer.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
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
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const slidesPerPage = getSlidesPerPage();
            if (currentIndex < visibleCards.length - slidesPerPage) {
                currentIndex++;
                updateSlider();
            }
        });
    }

    window.addEventListener('resize', () => {
        filterProducts(activeCategory);
        updateReviewsSlider();
        updateCasesSlider();
    });

    // Drag-to-scroll logic for Catalog Slider
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startOffset = 0;
    let hasDraggedCatalog = false;

    catalogTrack.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
    
    catalogTrack.addEventListener('pointerdown', (e) => {
        if (!visibleCards.length) return;
        const slidesPerPage = getSlidesPerPage();
        if (visibleCards.length <= slidesPerPage) return;
        
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        hasDraggedCatalog = false;
        catalogTrack.style.transition = 'none';
        catalogTrack.style.cursor = 'grabbing';
        
        const style = window.getComputedStyle(catalogTrack);
        const matrix = new DOMMatrixReadOnly(style.transform);
        startOffset = matrix.m41;
        
        catalogTrack.setPointerCapture(e.pointerId);
    });
    
    catalogTrack.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const dx = currentX - startX;
        if (Math.abs(dx) > 6) hasDraggedCatalog = true;
        catalogTrack.style.transform = `translateX(${startOffset + dx}px)`;
    });
    
    catalogTrack.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        catalogTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        catalogTrack.style.cursor = 'grab';
        
        const dx = e.clientX - startX;
        const cardWidth = visibleCards[0] ? visibleCards[0].offsetWidth : 330;
        const gap = 20;
        const slidesPerPage = getSlidesPerPage();
        
        if (Math.abs(dx) > cardWidth / 4) {
            const step = Math.round(dx / (cardWidth + gap));
            currentIndex -= step;
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > visibleCards.length - slidesPerPage) currentIndex = Math.max(0, visibleCards.length - slidesPerPage);
        }
        updateSlider();
        catalogTrack.releasePointerCapture(e.pointerId);
    });
    
    catalogTrack.addEventListener('pointercancel', (e) => {
        if (!isDragging) return;
        isDragging = false;
        catalogTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        catalogTrack.style.cursor = 'grab';
        updateSlider();
        catalogTrack.releasePointerCapture(e.pointerId);
    });

    // Intercept click event after dragging
    catalogTrack.addEventListener('click', (e) => {
        if (hasDraggedCatalog) {
            e.preventDefault();
            e.stopPropagation();
            hasDraggedCatalog = false;
        }
    }, true);
    
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
        const gap = window.innerWidth <= 1024 ? 16 : 22;
        
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

    // Drag-to-scroll (как в каталоге)
    let reviewsDragging = false;
    let reviewsStartX = 0;
    let reviewsCurrentX = 0;
    let reviewsStartOffset = 0;
    let hasDraggedReviews = false;

    reviewsTrack.addEventListener('dragstart', (e) => { e.preventDefault(); });

    reviewsTrack.addEventListener('pointerdown', (e) => {
        reviewsDragging = true;
        reviewsStartX = e.clientX;
        reviewsCurrentX = reviewsStartX;
        hasDraggedReviews = false;
        reviewsTrack.style.transition = 'none';
        reviewsTrack.style.cursor = 'grabbing';
        const matrix = new DOMMatrixReadOnly(window.getComputedStyle(reviewsTrack).transform);
        reviewsStartOffset = matrix.m41;
        reviewsTrack.setPointerCapture(e.pointerId);
    });

    reviewsTrack.addEventListener('pointermove', (e) => {
        if (!reviewsDragging) return;
        reviewsCurrentX = e.clientX;
        const dx = reviewsCurrentX - reviewsStartX;
        if (Math.abs(dx) > 6) hasDraggedReviews = true;
        reviewsTrack.style.transform = `translateX(${reviewsStartOffset + dx}px)`;
    });

    reviewsTrack.addEventListener('pointerup', (e) => {
        if (!reviewsDragging) return;
        reviewsDragging = false;
        reviewsTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        reviewsTrack.style.cursor = 'grab';
        const dx = e.clientX - reviewsStartX;
        const cardWidth = reviewsCards[0] ? reviewsCards[0].offsetWidth : 400;
        if (Math.abs(dx) > cardWidth / 4) {
            if (dx < 0 && reviewIndex < reviewsCards.length - 1) reviewIndex++;
            else if (dx > 0 && reviewIndex > 0) reviewIndex--;
        }
        updateReviewsSlider();
        reviewsTrack.releasePointerCapture(e.pointerId);
    });

    reviewsTrack.addEventListener('pointercancel', (e) => {
        if (!reviewsDragging) return;
        reviewsDragging = false;
        reviewsTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        reviewsTrack.style.cursor = 'grab';
        updateReviewsSlider();
        reviewsTrack.releasePointerCapture(e.pointerId);
    });

    reviewsTrack.addEventListener('click', (e) => {
        if (hasDraggedReviews) {
            e.preventDefault();
            e.stopPropagation();
            hasDraggedReviews = false;
        }
    }, true);

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
        
        caseIndex = Math.floor(filteredCases.length / 2);
        renderCasesDots();
        updateCasesSlider();
    }
    
    function updateCasesSlider() {
        if (filteredCases.length === 0) return;
        
        const wrapper = casesTrack.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        const cardWidth = filteredCases[0].offsetWidth;
        const gap = window.innerWidth <= 1024 ? 20 : 40;
        
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
    
    if (casesPrevBtn) {
        casesPrevBtn.addEventListener('click', () => {
            if (caseIndex > 0) {
                caseIndex--;
                updateCasesSlider();
            }
        });
    }
    
    if (casesNextBtn) {
        casesNextBtn.addEventListener('click', () => {
            if (caseIndex < filteredCases.length - 1) {
                caseIndex++;
                updateCasesSlider();
            }
        });
    }

    // Drag-to-scroll logic for Cases Slider
    let casesDragging = false;
    let casesStartX = 0;
    let casesCurrentX = 0;
    let casesStartOffset = 0;
    let hasDraggedCases = false;

    casesTrack.addEventListener('dragstart', (e) => { e.preventDefault(); });

    casesTrack.addEventListener('pointerdown', (e) => {
        if (filteredCases.length <= 1) return;
        casesDragging = true;
        casesStartX = e.clientX;
        casesCurrentX = casesStartX;
        hasDraggedCases = false;
        casesTrack.style.transition = 'none';
        casesTrack.style.cursor = 'grabbing';
        
        const matrix = new DOMMatrixReadOnly(window.getComputedStyle(casesTrack).transform);
        casesStartOffset = matrix.m41;
        
        casesTrack.setPointerCapture(e.pointerId);
    });

    casesTrack.addEventListener('pointermove', (e) => {
        if (!casesDragging) return;
        casesCurrentX = e.clientX;
        const dx = casesCurrentX - casesStartX;
        if (Math.abs(dx) > 6) hasDraggedCases = true;
        casesTrack.style.transform = `translateX(${casesStartOffset + dx}px)`;
    });

    casesTrack.addEventListener('pointerup', (e) => {
        if (!casesDragging) return;
        casesDragging = false;
        casesTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        casesTrack.style.cursor = 'grab';
        
        const dx = e.clientX - casesStartX;
        const cardWidth = filteredCases[0] ? filteredCases[0].offsetWidth : 940;
        const gap = window.innerWidth <= 1024 ? 20 : 40;
        
        if (Math.abs(dx) > cardWidth / 4) {
            if (dx < 0 && caseIndex < filteredCases.length - 1) {
                caseIndex++;
            } else if (dx > 0 && caseIndex > 0) {
                caseIndex--;
            }
        }
        updateCasesSlider();
        casesTrack.releasePointerCapture(e.pointerId);
    });

    casesTrack.addEventListener('pointercancel', (e) => {
        if (!casesDragging) return;
        casesDragging = false;
        casesTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        casesTrack.style.cursor = 'grab';
        updateCasesSlider();
        casesTrack.releasePointerCapture(e.pointerId);
    });

    casesTrack.addEventListener('click', (e) => {
        if (hasDraggedCases) {
            e.preventDefault();
            e.stopPropagation();
            hasDraggedCases = false;
        }
    }, true);

    window.updateCasesSlider = updateCasesSlider;

    // логика выпадающих подменю
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200) {
                e.preventDefault();
                e.stopPropagation();
                const parent = trigger.parentElement;
                parent.classList.toggle('active');
                
                // закрываем остальные
                document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
                    if (dropdown !== parent) {
                        dropdown.classList.remove('active');
                    }
                });
            }
        });
    });

    // фильтр товаров при клике в подменю
    const catalogCatLinks = document.querySelectorAll('[data-catalog-cat]');
    catalogCatLinks.forEach(link => {
        link.addEventListener('click', () => {
            const cat = link.getAttribute('data-catalog-cat');
            const tab = document.querySelector(`.catalog-tab[data-cat="${cat}"]`);
            if (tab) {
                // кликаем по табу
                tab.click();
            }
        });
    });

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

    // Воспроизведение видеоотзывов
    const videoCards = document.querySelectorAll('.video-card');

    function stopVideo(card) {
        const video = card.querySelector('video');
        if (video) {
            video.pause();
            video.remove();
        }
        
        const img = card.querySelector('img');
        const playBtn = card.querySelector('.play-btn');
        const progress = card.querySelector('.video-progress');
        
        if (img) img.style.display = '';
        if (playBtn) playBtn.style.display = '';
        if (progress) progress.remove();
    }

    videoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const video = this.querySelector('video');
            
            // Если видео уже воспроизводится, клик останавливает его и возвращает превью
            if (video) {
                stopVideo(this);
                return;
            }
            
            // Останавливаем все другие видео
            videoCards.forEach(otherCard => {
                if (otherCard !== this) {
                    stopVideo(otherCard);
                }
            });

            const img = this.querySelector('img');
            const playBtn = this.querySelector('.play-btn');

            // Скрываем превью и кнопку
            if (img) img.style.display = 'none';
            if (playBtn) playBtn.style.display = 'none';

            // Создаем тег video
            const videoEl = document.createElement('video');
            videoEl.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
            videoEl.autoplay = true;
            videoEl.playsInline = true;
            videoEl.controls = false; // Убираем элементы управления плеера
            videoEl.style.width = '100%';
            videoEl.style.height = '100%';
            videoEl.style.objectFit = 'cover';
            videoEl.style.borderRadius = '20px';

            // Создаем прогресс-бар
            const progressEl = document.createElement('div');
            progressEl.className = 'video-progress';

            this.appendChild(videoEl);
            this.appendChild(progressEl);

            videoEl.addEventListener('timeupdate', () => {
                if (videoEl.duration) {
                    const percent = (videoEl.currentTime / videoEl.duration) * 100;
                    progressEl.style.setProperty('--progress', `${percent}%`);
                }
            });

            videoEl.addEventListener('ended', () => {
                stopVideo(this);
            });
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
