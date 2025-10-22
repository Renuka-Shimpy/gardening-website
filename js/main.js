// Main JavaScript file for GreenBloom Nursery website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    setupNavigation();
    setupDarkMode();
    setupCart();
    loadFeaturedPlants();
    setupSmoothScroll();
    setupAnimations();
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Highlight active navigation based on current page
    highlightActiveNav();
}

// Highlight active navigation item
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Dark Mode Toggle
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateDarkModeButton(currentTheme);
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateDarkModeButton(newTheme);
        });
    }
}

// Update dark mode button text
function updateDarkModeButton(theme) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Cart functionality
function setupCart() {
    updateCartCount();
    
    // Cart icon click event
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon && window.location.pathname.includes('shop.html')) {
        cartIcon.addEventListener('click', function() {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.style.display = 'block';
                updateCartModal();
            }
        });
    }
    
    // Close modal when clicking X
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cartModal');
        if (cartModal && event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update cart modal content
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = total.toFixed(2);
    }
}

// Load featured plants on home page
function loadFeaturedPlants() {
    const featuredPlantsContainer = document.getElementById('featuredPlants');
    
    if (featuredPlantsContainer) {
        fetch('data/plants.json')
            .then(response => response.json())
            .then(plants => {
                // Get first 3 plants for featured section
                const featuredPlants = plants.slice(0, 3);
                displayFeaturedPlants(featuredPlants);
            })
            .catch(error => {
                console.error('Error loading plants:', error);
                featuredPlantsContainer.innerHTML = '<p>Error loading plants. Please try again later.</p>';
            });
    }
}

// Display featured plants
function displayFeaturedPlants(plants) {
    const featuredPlantsContainer = document.getElementById('featuredPlants');
    
    if (featuredPlantsContainer) {
        featuredPlantsContainer.innerHTML = plants.map(plant => `
            <div class="plant-card">
                <img src="${plant.image}" alt="${plant.name}">
                <div class="plant-info">
                    <h3>${plant.name}</h3>
                    <p class="scientific-name">${plant.scientificName}</p>
                    <div class="plant-details">
                        <div class="detail">
                            <span class="label">💧 Water:</span>
                            <span>${plant.wateringFrequency}</span>
                        </div>
                        <div class="detail">
                            <span class="label">☀️ Light:</span>
                            <span>${plant.sunlight}</span>
                        </div>
                    </div>
                    <a href="plants.html" class="btn btn-primary">Learn More</a>
                </div>
            </div>
        `).join('');
    }
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup animations
function setupAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.plant-card, .service-card, .product-card, .mission-card, .tip-card').forEach(el => {
        el.classList.add('fade-element');
        observer.observe(el);
    });
}

// Add CSS for fade animations
const style = document.createElement('style');
style.textContent = `
    .fade-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Global functions for cart operations
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

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    updateCartModal();
    showNotification('Cart cleared!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your purchase! This is a demo - no real transaction occurred.');
            clearCart();
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
});