
// Global State
let menuData = {};
let cart = {};

// Fetch Menu from API
async function loadMenuData() {
    try {
        const response = await fetch('/api/get_menu.php');
        const data = await response.json();

        // If API returns error or empty, fallback (optional, currently just logging)
        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        menuData = data;
        renderMenu();
    } catch (error) {
        console.error("Failed to load menu:", error);
    }
}

// State
// Cart Logic handled below

// Render Menu
// Render Menu
function renderMenu() {
    const navContainer = document.getElementById('dynamic-nav');
    const menuContainer = document.getElementById('dynamic-menu');

    // If elements don't exist (e.g. on index.html), we skip full rendering
    if (!navContainer || !menuContainer) return;

    navContainer.innerHTML = '';
    menuContainer.innerHTML = '';

    menuData.forEach((cat, index) => {
        // 1. Create Nav Button
        const btn = document.createElement('button');
        btn.className = `cat-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = cat.title;
        btn.onclick = (e) => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(cat.slug).scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        navContainer.appendChild(btn);

        // 2. Create Section
        const section = document.createElement('section');
        section.id = cat.slug;
        // Add scroll margin for sticky header
        section.style.scrollMarginTop = "140px";

        section.innerHTML = `
            <h2 class="section-title">${cat.title}</h2>
            <div class="menu-grid" id="grid-${cat.slug}"></div>
        `;
        menuContainer.appendChild(section);

        // 3. Populate Items
        const grid = section.querySelector('.menu-grid');
        cat.items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'menu-item';
            el.innerHTML = `
                <div class="menu-item-img" style="background-image: url('${item.img || '/assets/24183_main.avif'}')"></div>
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <h3 class="menu-item-title">${item.name}</h3>
                        <span class="menu-item-price">KES ${item.price.toLocaleString()}</span>
                    </div>
                    <p class="menu-item-desc">${item.desc}</p>
                    <button class="add-btn" onclick="addToCart('${item.id}', '${cat.slug}')">Add to Order</button>
                </div>
            `;
            grid.appendChild(el);
        });
    });
}

// Cart Logic
function addToCart(itemId, category) {
    if (cart[itemId]) {
        cart[itemId]++;
    } else {
        cart[itemId] = 1;
    }
    updateCartUI();
    showFloatingCart();

    // Feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added! ✓";
    btn.style.background = "#25D366";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1000);
}

function removeFromCart(itemId) {
    if (cart[itemId]) {
        cart[itemId]--;
        if (cart[itemId] <= 0) {
            delete cart[itemId];
        }
        updateCartUI();
    }
}

function getItemDetails(itemId) {
    for (const cat of menuData) {
        const found = cat.items.find(i => i.id === itemId);
        if (found) return found;
    }
    return null;
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalFloatEl = document.getElementById('cartTotalFloat');

    cartItemsContainer.innerHTML = '';

    let total = 0;
    let count = 0;

    const itemIds = Object.keys(cart);

    if (itemIds.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#777; margin-top:50px;">Your cart is empty.</p>';
        document.getElementById('floatingCart').style.display = 'none';
    } else {
        document.getElementById('floatingCart').style.display = 'flex';

        itemIds.forEach(id => {
            const item = getItemDetails(id);
            const qty = cart[id];
            const itemTotal = item.price * qty;

            total += itemTotal;
            count += qty;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span style="font-size:0.9rem; color:#666;">KES ${item.price} x ${qty}</span>
                </div>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="removeFromCart('${id}')">-</button>
                    <span>${qty}</span>
                    <button class="qty-btn" onclick="addToCart('${id}')">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    const fmtTotal = `KES ${total.toLocaleString()}`;
    cartTotalEl.innerText = fmtTotal;
    cartCountEl.innerText = `${count} Items`;
    cartTotalFloatEl.innerText = fmtTotal;
}

function showFloatingCart() {
    document.getElementById('floatingCart').style.display = 'flex';
}

function toggleCart() {
    document.getElementById('cartModal').classList.toggle('active');
    document.getElementById('cartBackdrop').classList.toggle('active');
}

function scrollToCategory(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update active button
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// WhatsApp Checkout
function checkoutWhatsApp() {
    if (Object.keys(cart).length === 0) return;

    let message = "Hi Samaki Street, I'd like to order:\n\n";
    let total = 0;

    for (const [id, qty] of Object.entries(cart)) {
        const item = getItemDetails(id);
        const itemTotal = item.price * qty;
        total += itemTotal;
        message += `• ${item.name} x${qty} - KES ${itemTotal}\n`;
    }

    message += `\n*Total: KES ${total.toLocaleString()}*`;
    message += `\n\nMy delivery location is: `;

    const phoneNumber = "254799034617"; // Updated per user request
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
}

// Initialize
// Initialize
document.addEventListener('DOMContentLoaded', loadMenuData);
