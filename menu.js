
const menuData = {
    streetwise: [
        { id: 's2', name: 'Streetwise 2', price: 490, desc: '2 Fish Fingers + Regular Chips', img: '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg' },
        { id: 's3', name: 'Streetwise 3', price: 690, desc: '3 Fish Fingers + Regular Chips', img: '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg' },
        { id: 's5', name: 'Streetwise 5', price: 1100, desc: '5 Fish Fingers + Large Chips', img: '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg' },
        { id: 's7', name: 'Streetwise 7', price: 1790, desc: '7 Fish Fingers + Large Chips', img: '/assets/Close-up-photo-of-a-serving-fish-and-chips.jpg' }
    ],
    buckets: [
        { id: 'b9', name: '9 PC Fish Bucket', price: 1900, desc: '9 Fish Fingers (No Sides)', img: '/assets/intro-1717534117.jpg' },
        { id: 'bk', name: 'Kentucky Bucket', price: 2550, desc: '11 Fish Fingers + 2 Large Chips', img: '/assets/intro-1717534117.jpg' },
        { id: 'bf', name: 'Colonel Bucket Feast', price: 2990, desc: '9 Fish Fingers + 1 Large Chips + Coleslaw + 2L Soda', img: '/assets/intro-1717534117.jpg' }
    ],
    boxes: [
        { id: 'bl', name: 'Fish Lunchbox', price: 850, desc: '2 Fish Fingers + Reg Chips + Coleslaw + 300ml Soda', img: '/assets/Homemade-Filet-O-Fish_3.webp' },
        { id: 'bcb', name: 'Crunch Burger Box', price: 950, desc: 'Fish Fillet Burger + 1 Fish Finger + Reg Chips + 300ml Soda', img: '/assets/Homemade-Filet-O-Fish_3.webp' },
        { id: 'bsb', name: 'Samaki Bites Box', price: 850, desc: '5 Spicy Fish Bites + Reg Chips + 300ml Soda', img: '/assets/l bh 57v77b v.jpg.webp' }
    ],
    burgers: [
        { id: 'cb', name: 'Colonel Burger (Fish)', price: 650, desc: 'Crispy breaded fish fillet, fresh lettuce, and sauce', img: '/assets/hero image.png' },
        { id: 'zb', name: 'Zinger Burger (Fish)', price: 700, desc: 'Spicy battered fish fillet, lettuce, and hot spicy sauce', img: '/assets/hero image.png' }
    ],
    drinks: [
        { id: 'd1', name: 'Pepsi (500ml)', price: 150, desc: 'Chilled Soda', img: '' },
        { id: 'd2', name: 'Coca-Cola (500ml)', price: 150, desc: 'Chilled Soda', img: '' },
        { id: 'd3', name: 'Mineral Water', price: 100, desc: 'Pure Water', img: '' },
        { id: 'd4', name: 'Minute Maid', price: 200, desc: 'Fruit Juice', img: '' }
    ]
};

// State
let cart = {}; // { itemId: quantity }

// Render Menu
function renderMenu() {
    for (const [category, items] of Object.entries(menuData)) {
        const container = document.getElementById(`grid-${category}`);
        if (!container) continue;

        items.forEach(item => {
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
                    <button class="add-btn" onclick="addToCart('${item.id}', '${category}')">Add to Order</button>
                </div>
            `;
            container.appendChild(el);
        });
    }
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
    for (const cat of Object.values(menuData)) {
        const found = cat.find(i => i.id === itemId);
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
document.addEventListener('DOMContentLoaded', renderMenu);
