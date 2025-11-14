const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
    }
);

document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

const cursor = document.getElementById('cursor');
let cursorVisible = true;

const activateCursor = () => cursor.classList.add('active');
const deactivateCursor = () => cursor.classList.remove('active');

document.addEventListener('mousemove', (event) => {
    if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorVisible = true;
    }

    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorVisible = true;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorVisible = false;
});

['a', 'button', '.btn'].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('mouseenter', activateCursor);
        el.addEventListener('mouseleave', deactivateCursor);
    });
});

const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

const carousel = document.querySelector('.carousel');
if (carousel) {
    let index = 0;
    const quotes = carousel.querySelectorAll('blockquote');

    quotes.forEach((quote, i) => {
        quote.style.opacity = i === 0 ? '1' : '0';
        quote.style.transition = 'opacity 1s ease';
        quote.style.position = 'absolute';
        quote.style.width = '100%';
    });

    carousel.style.position = 'relative';
    carousel.style.minHeight = '200px';

    setInterval(() => {
        quotes[index].style.opacity = '0';
        index = (index + 1) % quotes.length;
        quotes[index].style.opacity = '1';
    }, 5000);
}
