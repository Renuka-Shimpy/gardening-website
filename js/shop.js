// Shop functionality for GreenBloom Nursery

document.addEventListener('DOMContentLoaded', function() {
    initializeShop();
});

function initializeShop() {
    loadProducts();
    setupCategoryFilters();
    setupAddToCartButtons();
}

// Product data
const products = [
    {
        id: 1,
        name: "Gardening Gloves",
        category: "gloves",
        price: 12.99,
        image: "https://picsum.photos/300/200?random=10",
        description: "Durable leather gloves for comfortable gardening"
    },
    {
        id: 2,
        name: "Watering Can",
        category: "tools",
        price: 24.99,
        image: "https://picsum.photos/300/200?random=11",
        description: "2-gallon metal watering can with rose attachment"
    },
    {
        id: 3,
        name: "Gardening Shovel",
        category: "tools",
        price: 18.99,
        image: "https://picsum.photos/300/200?random=12",
        description: "Stainless steel digging shovel with ergonomic handle"
    },
    {
        id: 4,
        name: "Organic Fertilizer",
        category: "soil",
        price: 15.99,
        image: "https://picsum.photos/300/200?random=13",
        description: "All-natural plant food for healthy growth"
    },
    {
        id: 5,
        name: "Ceramic Plant Pot",
        category: "pots",
        price: 22.99,
        image: "https://picsum.photos/300/200?random=14",
        description: "8-inch decorative ceramic pot with drainage"
    },
    {
        id: 6,
        name: "Seed Starter Kit",
        category: "seeds",
        price: 29.99,
        image: "https://picsum.photos/300/200?random=15",
        description: "Complete kit with seeds, soil pods, and trays"
    },
    {
        id: 7,
        name: "Pruning Shears",
        category: "tools",
        price: 16.99,
        image: "https://picsum.photos/300/200?random=16",
        description: "Sharp bypass pruners for precise cutting"
    },
    {
        id: 8,
        name: "Potting Soil Mix",
        category: "soil",
        price: 8.99,
        image: "https://picsum.photos/300/200?random=17",
        description: "Premium potting mix for indoor and outdoor plants"
    }
];

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary add-to-cart-btn" 
                        data-product='${JSON.stringify(product)}'>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Setup category filters
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    // Use event delegation for dynamically added buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const product = JSON.parse(e.target.dataset.product);
            addToCart(product);
        }
    });
}

// Global addToCart function (also defined in main.js)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Global updateCartCount function
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Global showNotification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}