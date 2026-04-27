/* ============================================================
   SCRIPT.JS – Mono Mobileri
   Logjika e faqes: shporta, filtrat, animacionet
   ============================================================ */

// ---------- Të dhënat e produkteve ----------
const products = [
    { id: 1, name: 'Divan Luna', category: 'living', price: 1890, oldPrice: 2190, badge: 'bestseller', emoji: '🛋️', colors: ['#d4c5b2', '#3d3529', '#8b7d6b'] },
    { id: 2, name: 'Tavolinë Aero', category: 'living', price: 780, oldPrice: null, badge: 'new', emoji: '☕', colors: ['#e8dcc8', '#2a2218', '#c4b89e'] },
    { id: 3, name: 'Krevat Nova', category: 'bedroom', price: 2450, oldPrice: 2890, badge: 'sale', emoji: '🛏️', colors: ['#f5efe0', '#1e1b16', '#9c8e7a'] },
    { id: 4, name: 'Komodinë Drift', category: 'bedroom', price: 420, oldPrice: null, badge: null, emoji: '🗄️', colors: ['#ddd5c8', '#2c2822', '#b0a590'] },
    { id: 5, name: 'Tavolinë Forma', category: 'dining', price: 1650, oldPrice: 1890, badge: 'bestseller', emoji: '🍽️', colors: ['#e6ddd0', '#3a3025', '#c8bca5'] },
    { id: 6, name: 'Karrige Curve', category: 'dining', price: 350, oldPrice: null, badge: null, emoji: '🪑', colors: ['#d9cebe', '#25201a', '#a09480'] },
    { id: 7, name: 'Tavolinë Pivot', category: 'office', price: 1280, oldPrice: 1450, badge: 'sale', emoji: '🖥️', colors: ['#f0e8d8', '#1f1c17', '#8a7d6c'] },
    { id: 8, name: 'Raft Stack', category: 'office', price: 590, oldPrice: null, badge: 'new', emoji: '📚', colors: ['#e2d9ca', '#2e2922', '#b5a894'] },
    { id: 9, name: 'Llambë Arc', category: 'living', price: 460, oldPrice: null, badge: null, emoji: '💡', colors: ['#faf6ee', '#1a1814', '#d4c8b0'] },
    { id: 10, name: 'Kolltuk Nest', category: 'living', price: 1320, oldPrice: 1580, badge: 'bestseller', emoji: '🪑', colors: ['#ece4d5', '#332d24', '#bfb098'] },
    { id: 11, name: 'Garderobë Haven', category: 'bedroom', price: 3100, oldPrice: null, badge: 'new', emoji: '🚪', colors: ['#e8dfcf', '#25211b', '#a89980'] },
    { id: 12, name: 'Komodë Slice', category: 'dining', price: 950, oldPrice: 1120, badge: 'sale', emoji: '🗄️', colors: ['#ddd4c4', '#2b2720', '#c0b39a'] }
];

// ---------- Variablat globale ----------
let cart = [];
let currentFilter = 'all';
let productsShown = 6;

// ---------- Referenca DOM ----------
const productsGrid = document.getElementById('productsGrid');
const cartBadge = document.getElementById('cartBadge');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const cursorGlow = document.getElementById('cursorGlow');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterTabs = document.querySelectorAll('.filter-tab');

// ---------- Renderimi i produkteve ----------
function renderProducts(filter = 'all', limit = productsShown) {
    let filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    let displayed = filtered.slice(0, limit);

    if (!productsGrid) return;

    productsGrid.innerHTML = displayed.map(p => {
        const badgeHTML = p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : '';
        const oldPriceHTML = p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()} €</span>` : '';
        const colorsHTML = p.colors.map(c => `<span class="color-dot" style="background:${c};" title="Ngjyrë"></span>`).join('');

        return `
            <div class="product-card" data-category="${p.category}">
                <div class="product-img-wrap">
                    <span>${p.emoji}</span>
                    ${badgeHTML}
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="addToCart(${p.id})" title="Shto në shportë"><i class="fas fa-shopping-bag"></i></button>
                        <button class="product-action-btn" title="Shiko shpejt"><i class="fas fa-eye"></i></button>
                        <button class="product-action-btn" title="Shto te preferuarat"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${p.category}</span>
                    <h4>${p.name}</h4>
                    <div class="product-price">${p.price.toLocaleString()} € ${oldPriceHTML}</div>
                    <div class="product-colors">${colorsHTML}</div>
                </div>
            </div>
        `;
    }).join('');

    // Shfaq/fsheh butonin "Ngarko më shumë"
    if (loadMoreBtn) {
        loadMoreBtn.style.display = filtered.length <= limit ? 'none' : 'inline-flex';
    }
}

// ---------- Filtrimi i produkteve ----------
function filterProducts(category) {
    currentFilter = category;
    productsShown = 6;
    renderProducts(category, productsShown);

    // Aktivizo tab-in përkatës
    filterTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === category);
    });

    // Lëviz drejt seksionit të produkteve
    document.getElementById('produktet').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Event për filtrat
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        filterProducts(filter);
    });
});

// Ngarko më shumë
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        productsShown += 6;
        renderProducts(currentFilter, productsShown);
    });
}

// Klikimi në kartat e kategorive
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function () {
        const category = this.dataset.category;
        if (category) filterProducts(category);
    });
});

// ---------- Shporta ----------
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast(`✓ "${product.name}" u shtua në shportë`);
}

function addToCartFromBanner() {
    // Produkt special për banner-in
    const eclipse = { id: 99, name: 'Kolltuk Eclipse', category: 'living', price: 4200, oldPrice: null, badge: 'limited', emoji: '🪑', colors: ['#1a1a1a', '#8b6914'], quantity: 1 };
    const existing = cart.find(item => item.id === 99);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push(eclipse);
    }
    updateCartUI();
    showToast('✓ Kolltuk Eclipse u shtua në shportë!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Përditëso numrin në navbar
    if (cartBadge) {
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.add('show');
        } else {
            cartBadge.textContent = '0';
            cartBadge.classList.remove('show');
        }
    }

    // Totali
    if (cartTotal) {
        cartTotal.textContent = `${totalPrice.toLocaleString()} €`;
    }

    // Elementet e shportës
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Shporta është bosh</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img">${item.emoji}</div>
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <span class="cart-item-price">${item.price.toLocaleString()} € × ${item.quantity}</span>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
                </div>
            `).join('');
        }
    }
}

function openCart() {
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function checkout() {
    if (cart.length === 0) {
        showToast('Shporta juaj është bosh!');
        return;
    }
    showToast('🎉 Porosia u krye me sukses! Faleminderit.');
    cart = [];
    updateCartUI();
    closeCart();
}

// Mbivendosja - kliko jashtë për të mbyllur
if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}

// ---------- Toast ----------
let toastTimeout;
function showToast(message) {
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ---------- Menuja mobile ----------
function toggleMenu() {
    if (menuToggle) menuToggle.classList.toggle('active');
    if (navLinks) navLinks.classList.toggle('open');
}

function closeMenu() {
    if (menuToggle) menuToggle.classList.remove('active');
    if (navLinks) navLinks.classList.remove('open');
}

// Mbyll menunë kur klikohet një link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ---------- Efekti scroll në navbar ----------
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ---------- Kursor glow ----------
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// ---------- Newsletter ----------
function subscribeNewsletter(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input && input.value.trim()) {
        showToast('📧 Ju u abonuat me sukses! Mirë se vini.');
        input.value = '';
    }
}

// Bëje funksionin global për onclick në HTML
window.subscribeNewsletter = subscribeNewsletter;

// ---------- Shortcuts tastiere ----------
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closeMenu();
    }
    // Ctrl + C për shportë (jo për të kopjuar tekst)
    if (e.key === 'c' && e.ctrlKey && document.activeElement === document.body) {
        e.preventDefault();
        openCart();
    }
});

// ---------- Inicializimi ----------
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    // Eventet shtesë për butonat e hapjes së shportës në navbar
    const cartBtn = document.querySelector('.nav-icon-btn[aria-label="Shporta"]');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
});

// Ekspozo funksionet globale për onclick në HTML
window.addToCart = addToCart;
window.addToCartFromBanner = addToCartFromBanner;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.checkout = checkout;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.filterProducts = filterProducts;