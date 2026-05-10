document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const loader = document.querySelector('.loader');
    const themeToggle = document.querySelector('#themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('.nav');
    const scrollToTop = document.querySelector('#scrollToTop');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    body.setAttribute('data-theme', activeTheme);
    updateThemeIcon(activeTheme);

    window.addEventListener('load', () => {
        if (!loader) return;
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    });

    themeToggle?.addEventListener('click', () => {
        const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        updateThemeIcon(nextTheme);
    });

    hamburger?.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = navLinks?.classList.toggle('active') || false;
        hamburger.setAttribute('aria-expanded', String(isOpen));
        body.classList.toggle('no-scroll', isOpen);
        updateMenuIcon(isOpen);
    });

    document.addEventListener('click', (event) => {
        if (!nav || !navLinks?.classList.contains('active')) return;
        if (!nav.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            closeOpenModal();
        }
    });

    navLinks?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) closeMenu();
    });

    window.addEventListener('scroll', () => {
        scrollToTop?.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    scrollToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.querySelector('#download-cv')?.addEventListener('click', (event) => {
        event.preventDefault();

        const link = document.createElement('a');
        link.href = 'assets/vishal_cv.pdf';
        link.download = 'Vishal_Bhutekar_CV.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
    });

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.classList.toggle('fa-moon', theme === 'light');
        themeIcon.classList.toggle('fa-sun', theme === 'dark');
    }

    function updateMenuIcon(isOpen) {
        const icon = hamburger?.querySelector('i');
        if (!icon) return;
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
    }

    function closeMenu() {
        navLinks?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
        updateMenuIcon(false);
    }
});

function openImageModal(imgElement) {
    const src = imgElement.getAttribute('data-src') || imgElement.getAttribute('src');
    const alt = imgElement.getAttribute('data-alt') || imgElement.getAttribute('alt') || 'Portfolio image';

    openModal(`
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <img src="${src}" alt="${alt}" class="modal-image">
            <div class="modal-info">
                <p>${alt}</p>
            </div>
        </div>
    `, 'image-modal');
}

function openCertificateModal(element) {
    const image = element.querySelector('img');
    if (!image) return;

    const certificatePath = image.getAttribute('data-certificate') || image.getAttribute('src');
    const alt = image.getAttribute('alt') || 'Certificate';
    const isPdf = certificatePath.toLowerCase().endsWith('.pdf');
    const media = isPdf
        ? `<embed src="${certificatePath}" type="application/pdf" width="100%" height="100%">
           <div class="modal-fallback"><p><a href="${certificatePath}" target="_blank" rel="noopener noreferrer">Open certificate</a></p></div>`
        : `<img src="${certificatePath}" alt="${alt}" class="modal-image">`;

    openModal(`
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            ${media}
        </div>
    `, 'certificate-modal');
}

function openModal(content, className) {
    closeOpenModal();

    const modal = document.createElement('div');
    modal.className = className;
    modal.innerHTML = content;
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));
    });

    modal.querySelector('.modal-close')?.addEventListener('click', closeOpenModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeOpenModal();
    });
}

function closeOpenModal() {
    const modal = document.querySelector('.image-modal, .certificate-modal');
    if (!modal) return;

    modal.classList.remove('show');
    document.body.classList.remove('no-scroll');
    setTimeout(() => modal.remove(), 150);
}
