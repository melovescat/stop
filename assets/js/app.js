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
    },
);

document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

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
    });

    setInterval(() => {
        quotes[index].style.opacity = '0';
        index = (index + 1) % quotes.length;
        quotes[index].style.opacity = '1';
    }, 5200);
}

const cartState = [];

const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartItemsContainer = document.getElementById('cartItems');
const cartSummary = document.querySelector('.cart-summary');
const cartCheckout = document.querySelector('.cart-checkout');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.querySelector('.cart-count');

const formatPrice = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(value);

const updateCartCount = () => {
    const totalCount = cartState.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalCount;
    }
};

const renderCart = () => {
    if (!cartState.length) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is currently a blank canvas.</p>';
        cartSummary.hidden = true;
        cartCheckout.hidden = true;
        cartTotalEl.textContent = '$0';
        updateCartCount();
        return;
    }

    cartItemsContainer.innerHTML = cartState
        .map(
            (item) => `
                <div class="cart-item" data-name="${item.name}">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div class="meta">
                            <div class="quantity-controls" data-name="${item.name}">
                                <button class="qty-btn" data-action="decrement" aria-label="Decrease quantity">−</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" data-action="increment" aria-label="Increase quantity">+</button>
                            </div>
                            <span class="price">${formatPrice(item.price * item.quantity)}</span>
                        </div>
                        <button class="remove-item" data-action="remove">Remove</button>
                    </div>
                </div>
            `,
        )
        .join('');

    const total = cartState.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartSummary.hidden = false;
    cartCheckout.hidden = false;
    cartTotalEl.textContent = formatPrice(total);
    updateCartCount();
};

const openCart = () => {
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartBackdrop.hidden = false;
    requestAnimationFrame(() => cartBackdrop.classList.add('active'));
};

const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartBackdrop.classList.remove('active');
    setTimeout(() => {
        if (!cartDrawer.classList.contains('open')) {
            cartBackdrop.hidden = true;
        }
    }, 350);
};

const addItemToCart = ({ name, price, image, description }, openAfter = false) => {
    const existing = cartState.find((item) => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cartState.push({ name, price, image, description, quantity: 1 });
    }

    renderCart();

    if (openAfter) {
        openCart();
    }
};

const removeItem = (name) => {
    const index = cartState.findIndex((item) => item.name === name);
    if (index !== -1) {
        cartState.splice(index, 1);
        renderCart();
    }
};

const adjustQuantity = (name, delta) => {
    const item = cartState.find((entry) => entry.name === name);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeItem(name);
    } else {
        renderCart();
    }
};

const cartToggle = document.querySelector('.cart-toggle');
cartToggle?.addEventListener('click', () => {
    if (cartDrawer.classList.contains('open')) {
        closeCart();
    } else {
        openCart();
    }
});

const cartClose = document.querySelector('.cart-close');
cartClose?.addEventListener('click', closeCart);

cartBackdrop?.addEventListener('click', closeCart);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cartDrawer.classList.contains('open')) {
        closeCart();
    }
});

cartItemsContainer?.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const cartItem = event.target.closest('.cart-item');
    const name = cartItem?.dataset.name || event.target.closest('.quantity-controls')?.dataset.name;

    if (!name) return;

    if (action === 'remove') {
        removeItem(name);
    } else if (action === 'increment') {
        adjustQuantity(name, 1);
    } else if (action === 'decrement') {
        adjustQuantity(name, -1);
    }
});

const productButtons = document.querySelectorAll('.add-to-cart');
productButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const { name, price, image, description } = button.dataset;
        addItemToCart({
            name,
            price: Number(price),
            image,
            description,
        });
    });
});

const buyNowButtons = document.querySelectorAll('.buy-now');
buyNowButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const { name, price, image, description } = button.dataset;
        addItemToCart(
            {
                name,
                price: Number(price),
                image,
                description,
            },
            true,
        );
    });
});

cartCheckout?.addEventListener('click', () => {
    if (!cartState.length) return;
    alert('Thank you. An Aria concierge will reach out to finalise your bespoke purchase.');
});

renderCart();
