// ==================== main.js برای نوین دیجیتال ====================
// نسخه: 2.0.0 - کاملا اصلاح‌شده
// تاریخ: 1403/12/20
// توسعه‌دهنده: محدثه اسلامی

// ==================== متغیرهای جهانی ====================
let cart = JSON.parse(localStorage.getItem('novinCart')) || [];
let products = [
    { id: 1, name: 'آیفون ۱۷ CH/A', price: 45000000, category: 'mobile' },
    { id: 2, name: 'سامسونگ Galaxy S25 Ultra', price: 52000000, category: 'mobile' },
    { id: 3, name: 'آیفون ۱۶ Pro Max ZA/A', price: 58000000, category: 'mobile' },
    { id: 4, name: 'آیفون ۱۷ Pro ZA/A', price: 62000000, category: 'mobile' },
    { id: 5, name: 'هندزفری انکر Soundcore P40i', price: 3500000, category: 'headphone' },
    { id: 6, name: 'اپل واچ SE3 مدل ۴۴mm', price: 18000000, category: 'watch' },
    { id: 7, name: 'لپ‌تاپ ایسر ۱۶ اینچ Aspire Lite', price: 42000000, category: 'laptop' },
    { id: 8, name: 'هندزفری شیائومی Redmi Buds 6 Active', price: 2800000, category: 'headphone' }
];

// ==================== رویداد DOM Content Loaded ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 نوین دیجیتال راه‌اندازی شد!');

    // 1. راه‌اندازی اسکرول به بالا
    initScrollToTop();

    // 2. راه‌اندازی تایمر تخفیف‌ها
    initNovinTimer();

    // 3. راه‌اندازی فیلتر محصولات
    initProductFilters();

    // 4. راه‌اندازی سیستم سبد خرید
    initCartSystem();

    // 5. راه‌اندازی سیستم توست
    initToastSystem();

    // 6. راه‌اندازی سیستم لودینگ
    initLoadingOverlay();

    // 7. راه‌اندازی سیستم جستجو
    initAdvancedSearch();

    // 8. تنظیم منوی فعال
    setActiveMenu();

    // 9. رویدادهای خبرنامه و دکمه‌های آموزش
    initExtraEvents();

    // 10. چک اولیه کاربر وارد شده
    checkUserStatus();
});

// ==================== 1. اسکرول به بالا ====================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    // نمایش/مخفی کردن دکمه
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    // رویداد کلیک
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== 2. تایمر تخفیف‌ها ====================
function initNovinTimer() {
    const timerElement = document.getElementById('novinTimer');
    if (!timerElement) return;

    let time = 2 * 3600 + 45 * 60 + 18; // 02:45:18 ثانیه

    function updateTimer() {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        timerElement.textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (time > 0) {
            time--;
        } else {
            timerElement.textContent = '۰۰:۰۰:۰۰';
            timerElement.style.color = '#ef4444';
            clearInterval(timerInterval);
            showToast('زمان تخفیف به پایان رسید!', 'warning');
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// ==================== 3. فیلتر محصولات ====================
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('[data-category]');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // حذف کلاس active از همه دکمه‌ها
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // اضافه کردن کلاس active به دکمه کلیک شده
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // فیلتر محصولات
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            showToast(`محصولات ${this.textContent} نمایش داده شد`, 'success');
        });
    });
}

// ==================== 4. سیستم سبد خرید ====================
function initCartSystem() {
    // به‌روزرسانی بج سبد خرید
    updateCartBadge();

    // رویداد کلیک روی دکمه‌های افزودن به سبد
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product'));
            addToCart(productId);
            animateAddToCart(this);
        });
    });

    // نمایش سبد خرید در مودال
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', function() {
            updateCartDisplay();
        });
    }

    // دکمه ثبت سفارش در مودال
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showToast('سبد خرید شما خالی است', 'warning');
                return;
            }

            // بررسی اگر کاربر وارد شده
            const userData = localStorage.getItem('novinUser');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.isLoggedIn) {
                    window.location.href = 'checkout.html';
                } else {
                    window.location.href = 'login.html';
                }
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}

// افزودن به سبد خرید
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // ذخیره در localStorage
    localStorage.setItem('novinCart', JSON.stringify(cart));

    // آپدیت نمایش
    updateCartBadge();
    updateCartDisplay();

    // نمایش پیام موفقیت
    showToast(`${product.name} به سبد خرید اضافه شد`, 'success');
}

// آپدیت بج سبد خرید
function updateCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// آپدیت نمایش سبد خرید
function updateCartDisplay() {
    const emptyMessage = document.getElementById('emptyCartMessage');
    const itemsContainer = document.getElementById('cartItemsContainer');
    const itemList = document.getElementById('cartItemList');
    const totalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (itemsContainer) itemsContainer.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        if (emptyMessage) emptyMessage.style.display = 'none';
        if (itemsContainer) itemsContainer.style.display = 'block';
        if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

        // محاسبه جمع کل
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (totalElement) {
            totalElement.textContent = formatPrice(total) + ' تومان';
        }

        // نمایش آیتم‌ها
        if (itemList) {
            itemList.innerHTML = cart.map(item => `
                <div class="cart-item d-flex align-items-center p-3 border-bottom">
                    <div class="cart-item-image me-3">
                        <div style="width: 60px; height: 60px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-phone fs-4 text-muted"></i>
                        </div>
                    </div>
                    <div class="cart-item-info flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted small mb-1">${formatPrice(item.price)} تومان</p>
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-price text-start">
                        <strong class="text-danger">${formatPrice(item.price * item.quantity)} تومان</strong>
                        <button class="btn btn-link text-danger p-0 mt-1" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// آپدیت تعداد محصول در سبد (تابع گلوبال)
window.updateCartQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('novinCart', JSON.stringify(cart));
            updateCartBadge();
            updateCartDisplay();
        }
    }
};

// حذف از سبد خرید (تابع گلوبال)
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('novinCart', JSON.stringify(cart));
    updateCartBadge();
    updateCartDisplay();
    showToast('محصول از سبد خرید حذف شد', 'info');
};

// انیمیشن افزودن به سبد
function animateAddToCart(button) {
    button.classList.add('click-effect');
    setTimeout(() => {
        button.classList.remove('click-effect');
    }, 300);

    // ایجاد افکت بصری
    const cartIcon = document.querySelector('[data-bs-target="#cartModal"]');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate-bounce');
        }, 500);
    }
}

// ==================== 5. سیستم توست ====================
function initToastSystem() {
    // تابع ایجاد توست (گلوبال)
    window.showToast = function(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            // ایجاد کانتینر اگر وجود ندارد
            const container = document.createElement('div');
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
            return showToast(message, type); // دوباره صدا بزن
        }

        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast novin-toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('id', toastId);

        const icon = type === 'success' ? 'check-circle' :
            type === 'error' ? 'exclamation-circle' :
            type === 'warning' ? 'exclamation-triangle' : 'info-circle';

        toast.innerHTML = `
            <div class="toast-header">
                <i class="bi bi-${icon} me-2 text-${type}"></i>
                <strong class="me-auto">نوین دیجیتال</strong>
                <small>همین الان</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toast);

        // راه‌اندازی توست Bootstrap
        const bsToast = new bootstrap.Toast(toast, {
            animation: true,
            autohide: true,
            delay: 3000
        });

        bsToast.show();

        // حذف توست پس از پنهان شدن
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    };
}

// ==================== 6. سیستم لودینگ ====================
function initLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;

    // توابع گلوبال
    window.showLoading = function() {
        loadingOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.hideLoading = function() {
        loadingOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
}

// ==================== 7. جستجوی پیشرفته ====================
function initAdvancedSearch() {
    const searchBtn = document.getElementById('modalSearchBtn');
    const searchInput = document.querySelector('.search-modal-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

// انجام جستجو
function performSearch(query) {
    if (!query.trim()) {
        showToast('لطفا عبارتی برای جستجو وارد کنید', 'warning');
        return;
    }

    showLoading();

    // شبیه‌سازی جستجو
    setTimeout(() => {
        hideLoading();
        const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
        if (searchModal) searchModal.hide();

        showToast(`نتایج جستجو برای "${query}"`, 'info');
        // در حالت واقعی، اینجا کاربر به صفحه نتایج هدایت می‌شود
        // window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }, 1500);
}

// ==================== 8. تنظیم منوی فعال ====================
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==================== 9. رویدادهای اضافی ====================
function initExtraEvents() {
    // رویداد برای خبرنامه
    const newsletterBtn = document.getElementById('newsletterSubscribe');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput.value && validateEmail(emailInput.value)) {
                showLoading();
                setTimeout(() => {
                    hideLoading();
                    showToast('عضویت شما در خبرنامه با موفقیت انجام شد!', 'success');
                    emailInput.value = '';
                }, 1000);
            } else {
                showToast('لطفا یک ایمیل معتبر وارد کنید', 'warning');
            }
        });
    }

    // تابع کلیک روی دکمه‌های آموزش
    document.querySelectorAll('.btn-training').forEach(button => {
        button.addEventListener('click', function() {
            showToast('این دوره به زودی ارائه خواهد شد', 'info');
        });
    });

    // رویداد برای دکمه‌های علاقه‌مندی
    const wishlistBadges = document.querySelectorAll('.icon-badge');
    wishlistBadges.forEach(badge => {
        if (badge.textContent === '۳' || badge.textContent === '۵') {
            badge.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showToast('برای مشاهده علاقه‌مندی‌ها، وارد حساب کاربری شوید', 'info');
            });
        }
    });

    // لینک‌های ورود و ثبت‌نام در dropdown
    const loginLinks = document.querySelectorAll('a[href="login.html"], a[href="register.html"]');
    loginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // در حالت واقعی به صفحه مورد نظر هدایت می‌شود
            if (this.getAttribute('href') === 'login.html') {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'register.html';
            }
        });
    });
}

// ==================== 10. بررسی وضعیت کاربر ====================
function checkUserStatus() {
    const userData = localStorage.getItem('novinUser');
    if (userData) {
        const user = JSON.parse(userData);
        // اگر کاربر وارد شده، می‌توانیم منو را تغییر دهیم
        const userDropdown = document.querySelector('.nav-icon.dropdown-toggle');
        if (userDropdown && user.isLoggedIn) {
            // می‌توانیم آیکون را تغییر دهیم
            userDropdown.innerHTML = '<i class="bi bi-person-check"></i>';
        }
    }
}

// ==================== توابع کمکی ====================

// فرمت قیمت
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// اعتبارسنجی ایمیل
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// تابع خروج از حساب (برای استفاده در صفحات مختلف)
window.logoutUser = function() {
    if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
        localStorage.removeItem('novinUser');
        showToast('با موفقیت خارج شدید', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
};

// جلوگیری از ارسال فرم‌ها (برای فرم‌های نمایشی)
document.querySelectorAll('form').forEach(form => {
    if (!form.id) { // فقط فرم‌های بدون ID را بگیر
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('فرم با موفقیت ارسال شد', 'success');
        });
    }
});

// ==================== مدیریت خطاها ====================
window.addEventListener('error', function(e) {
    console.error('خطا در سیستم:', e.error);
    showToast('خطایی در سیستم رخ داده است', 'error');
});

// ==================== تم تیره/روشن (آپشنال) ====================
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(`تم ${isDark ? 'تیره' : 'روشن'} فعال شد`, 'info');
};

// ==================== توابع کمکی اضافی ====================

// چک کردن اسکرول برای دکمه اسکرول به بالا
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
});

// رویداد کلیک برای همه دکمه‌های آموزش
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-training') ||
        e.target.closest('.btn-training')) {
        showToast('این دوره به زودی ارائه خواهد شد', 'info');
    }
});
// ==================== سیستم لودینگ صفحه ====================

function initPageLoader() {
    const pageLoader = document.getElementById('pageLoader');
    const progressFill = document.querySelector('.progress-fill');
    const percentage = document.querySelector('.percentage');

    if (!pageLoader) return;

    // مخفی کردن لودینگ بعد از 3 ثانیه
    setTimeout(() => {
        pageLoader.classList.add('hidden');

        // حذف کامل از DOM بعد از انیمیشن
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 500);
    }, 3000);

    // شبیه‌سازی پیشرفت
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) {
            progress = 100;
            clearInterval(progressInterval);
        }

        if (progressFill) {
            progressFill.style.width = progress + '%';
        }

        if (percentage) {
            percentage.textContent = Math.round(progress) + '٪';
        }
    }, 100);
}

// فراخوانی در DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    // ... کدهای دیگر
});