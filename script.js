// DOM 요소들
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');

// 모바일 네비게이션 토글
function toggleMobileNav() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// 네비게이션 링크 클릭 시 모바일 메뉴 닫기
function closeMobileNav() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// 부드러운 스크롤 기능
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// 폼 검증 및 제출
function validateForm(formData) {
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    if (!name) {
        return { isValid: false, message: '이름을 입력해주세요.' };
    }
    
    if (!email) {
        return { isValid: false, message: '이메일을 입력해주세요.' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
    }
    
    if (!message) {
        return { isValid: false, message: '메시지를 입력해주세요.' };
    }
    
    return { isValid: true };
}

// 알림 메시지 표시
function showNotification(message, type = 'success') {
    // 기존 알림이 있다면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 추가
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션 실행
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 스크롤 시 헤더 스타일 변경
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#ffffff';
        header.style.backdropFilter = 'none';
    }
}

// 요소가 뷰포트에 나타날 때 애니메이션
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들 선택
    const elementsToObserve = document.querySelectorAll('.service-card, .about-text, .contact-info');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 이벤트 리스너들
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 네비게이션 토글
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // 네비게이션 링크 클릭 처리
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 내부 링크인 경우 부드러운 스크롤 적용
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                closeMobileNav();
            }
        });
    });
    
    // 연락처 폼 제출 처리
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const validation = validateForm(formData);
            
            if (!validation.isValid) {
                showNotification(validation.message, 'error');
                return;
            }
            
            // 폼 제출 시뮬레이션 (실제로는 서버로 데이터 전송)
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = '전송 중...';
            submitButton.disabled = true;
            
            // 2초 후 성공 메시지 표시 (실제 구현 시에는 서버 응답 처리)
            setTimeout(() => {
                showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // 스크롤 이벤트 처리
    window.addEventListener('scroll', handleHeaderScroll);
    
    // 요소 관찰 시작
    observeElements();
    
    // 외부 클릭 시 모바일 메뉴 닫기
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileNav();
        }
    });
    
    // ESC 키로 모바일 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });
});

// 윈도우 리사이즈 처리
window.addEventListener('resize', function() {
    // 데스크톱 크기로 변경 시 모바일 메뉴 닫기
    if (window.innerWidth > 768) {
        closeMobileNav();
    }
});

// 페이지 로드 시 URL 해시가 있으면 해당 섹션으로 스크롤
window.addEventListener('load', function() {
    if (window.location.hash) {
        setTimeout(() => {
            smoothScroll(window.location.hash);
        }, 100);
    }
});

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
    // Tab 키로 포커스 이동 시 모바일 메뉴가 열려있으면 메뉴 내에서만 이동
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// 성능 최적화: 스크롤 이벤트 쓰로틀링
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 쓰로틀링된 스크롤 핸들러 적용
window.addEventListener('scroll', throttle(handleHeaderScroll, 16));