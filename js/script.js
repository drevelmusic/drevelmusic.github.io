        // === УМНОЕ ПОВЕДЕНИЕ ПЕРЕКЛЮЧАТЕЛЯ ЯЗЫКОВ ===
        (function () {
            const STORAGE_KEY = 'preferred-lang';
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            const isEnglishPage = currentFile === 'index-en.html';
            const currentLang = isEnglishPage ? 'en' : 'ru';

            // 1. Сохраняем выбор языка при клике на флаг
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    const lang = this.getAttribute('data-lang');
                    localStorage.setItem(STORAGE_KEY, lang);
                });
            });

            // 2. При первом посещении — определяем язык по браузеру
            const savedLang = localStorage.getItem(STORAGE_KEY);
            if (!savedLang) {
                const browserLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
                const isRussianBrowser = browserLang.startsWith('ru');
                const targetLang = isRussianBrowser ? 'ru' : 'en';

                // Если язык браузера не совпадает с текущей страницей — предлагаем переключить
                if (targetLang !== currentLang) {
                    // Показываем ненавязчивое уведомление
                    showLangNotification(targetLang);
                }

                // Сохраняем выбор, чтобы не спрашивать снова
                localStorage.setItem(STORAGE_KEY, targetLang);
            }
        })();

        // Ненавязчивое уведомление о переключении языка
        function showLangNotification(targetLang) {
            const message = targetLang === 'en' ?
                'Switch to English? / Переключить на английский?' :
                'Switch to Russian? / Переключить на русский?';
            const targetFile = targetLang === 'en' ? 'index-en.html' : 'index.html';

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; bottom: 30px; right: 30px; z-index: 9999;
                background: #15151a; border: 1px solid #d4af37; color: #f0f0f0;
                padding: 1rem 1.5rem; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                font-family: 'Montserrat', sans-serif; font-size: 0.95rem;
                display: flex; gap: 1rem; align-items: center;
                animation: slideIn 0.4s ease-out;
            `;
            notification.innerHTML = `
                <span>${message}</span>
                <button onclick="window.location.href='${targetFile}'" style="
                    background: #d4af37; color: #0a0a0c; border: none; padding: 0.5rem 1rem;
                    border-radius: 50px; font-weight: 700; cursor: pointer; font-family: inherit;
                ">OK</button>
                <button onclick="this.parentElement.remove()" style="
                    background: transparent; color: #a0a0a5; border: 1px solid #2a2a30;
                    padding: 0.5rem 0.8rem; border-radius: 50px; cursor: pointer; font-family: inherit;
                ">✕</button>
            `;

            // Добавляем анимацию
            const style = document.createElement('style');
            style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            // Автоскрытие через 10 секунд
            setTimeout(() => {
                if (notification.parentElement) notification.remove();
            }, 10000);
        }

        // Скрипт отключения анимации при повторной загрузке
        if (sessionStorage.getItem('logoAnimated')) {
            document.querySelector('.logo').style.animation = 'none';
            document.querySelector('.logo').style.opacity = '1';
        } else {
            sessionStorage.setItem('logoAnimated', 'true');
        }
