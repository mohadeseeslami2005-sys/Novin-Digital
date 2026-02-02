/**
 * سیستم آرشیو بلاگ نوین دیجیتال
 * نسخه: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 سیستم آرشیو بلاگ فعال شد');

    // 1. سیستم نشانگر مقالات خوانده شده
    initReadArticles();

    // 2. سیستم فیلتر دسته‌بندی
    initCategoryFilter();

    // 3. سیستم انیمیشن کارت‌ها
    initCardAnimations();

    // 4. سیستم ذخیره تاریخ آخرین بازدید
    initLastVisit();
});

// ==================== 1. مقالات خوانده شده ====================
function initReadArticles() {
    let readArticles = JSON.parse(localStorage.getItem('novinReadArticles')) || [];
    const readButtons = document.querySelectorAll('.btn-archive-read');

    readButtons.forEach(button => {
        const card = button.closest('.archive-card');
        const title = card.querySelector('.archive-title').textContent;

        // اگر مقاله قبلاً خوانده شده
        if (readArticles.includes(title)) {
            markAsRead(card);
        }

        // ذخیره هنگام کلیک
        button.addEventListener('click', function(e) {
            if (!readArticles.includes(title)) {
                readArticles.push(title);
                localStorage.setItem('novinReadArticles', JSON.stringify(readArticles));
                markAsRead(card);

                if (typeof showToast === 'function') {
                    showToast('مقاله به لیست خوانده‌ها اضافه شد', 'success');
                }
            }
        });
    });
}

function markAsRead(card) {
    if (!card.querySelector('.read-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'read-indicator';
        indicator.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: #10b981;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            animation: fadeIn 0.5s ease;
        `;
        card.querySelector('.archive-card-img').appendChild(indicator);
    }
}

// ==================== 2. فیلتر دسته‌بندی ====================
function initCategoryFilter() {
    const categoryBadges = document.querySelectorAll('.card-badge');

    categoryBadges.forEach(badge => {
        badge.style.cursor = 'pointer';

        badge.addEventListener('click', function(e) {
            e.stopPropagation();
            const category = this.textContent.trim();
            const cards = document.querySelectorAll('.archive-card');

            cards.forEach(card => {
                const cardCategory = card.querySelector('.card-badge').textContent.trim();

                if (category === 'همه' || cardCategory === category) {
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

            // اسکرول به بالا
            window.scrollTo({
                top: 300,
                behavior: 'smooth'
            });

            // نمایش پیام
            if (typeof showToast === 'function') {
                showToast(`دسته‌بندی: ${category}`, 'info');
            }
        });
    });
}

// ==================== 3. انیمیشن کارت‌ها ====================
function initCardAnimations() {
    const cards = document.querySelectorAll('.archive-card');

    cards.forEach((card, index) => {
        // تأخیر برای انیمیشن متوالی
        card.style.animationDelay = `${index * 0.1}s`;

        // افکت hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });

        // کلیک روی کل کارت
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-archive-read') &&
                !e.target.closest('.card-badge')) {
                const link = this.querySelector('.btn-archive-read');
                if (link) {
                    // شبیه‌سازی کلیک روی دکمه مطالعه
                    link.click();
                }
            }
        });
    });
}

// ==================== 4. تاریخ آخرین بازدید ====================
function initLastVisit() {
    const lastVisit = localStorage.getItem('lastBlogVisit');
    const now = new Date().toLocaleString('fa-IR');

    if (lastVisit) {
        console.log(`📅 آخرین بازدید از آرشیو: ${lastVisit}`);
    }

    localStorage.setItem('lastBlogVisit', now);
}

// ==================== اضافه کردن استایل‌های انیمیشن ====================
(function addBlogStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .archive-card {
            animation: fadeIn 0.6s ease;
            animation-fill-mode: both;
        }
        
        .read-indicator {
            animation: fadeIn 0.5s ease !important;
        }
    `;
    document.head.appendChild(style);
})();

// ==================== تابع ریست خوانده‌ها ====================
window.resetReadArticles = function() {
    if (confirm('آیا می‌خواهید تاریخچه مقالات خوانده شده ریست شود؟')) {
        localStorage.removeItem('novinReadArticles');
        document.querySelectorAll('.read-indicator').forEach(el => el.remove());

        if (typeof showToast === 'function') {
            showToast('تاریخچه خوانده‌ها ریست شد', 'info');
        }

        setTimeout(() => {
            location.reload();
        }, 1000);
    }
};

console.log('✅ سیستم آرشیو بلاگ آماده است');