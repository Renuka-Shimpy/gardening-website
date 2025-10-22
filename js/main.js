// Enhanced main.js with new features

// Hero Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Quick Actions
function initQuickActions() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const quickChatBtn = document.getElementById('quickChat');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.querySelector('.chat-close');
    
    // Scroll to top
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
    }
    
    // Chat widget
    if (quickChatBtn && chatWidget) {
        quickChatBtn.addEventListener('click', () => {
            chatWidget.classList.toggle('active');
        });
        
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWidget.classList.remove('active');
            });
        }
        
        // Simple chat responses
        const chatInput = chatWidget.querySelector('input');
        const chatBody = chatWidget.querySelector('.chat-body');
        const sendBtn = chatWidget.querySelector('.chat-input button');
        
        const responses = {
            'watering': 'Most plants need watering when the top inch of soil is dry. Stick your finger in the soil to check!',
            'sunlight': 'Different plants need different light conditions. Check the plant care instructions for specific needs.',
            'fertilizer': 'Fertilize during growing season (spring/summer). Use organic fertilizers for best results.',
            'pests': 'For common pests, try neem oil solution. Isolate affected plants to prevent spreading.',
            'repotting': 'Repot when roots outgrow the container, typically every 1-2 years in spring.'
        };
        
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
            messageDiv.innerHTML = `<p>${text}</p>`;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
        
        function handleChatInput() {
            const message = chatInput.value.trim().toLowerCase();
            if (!message) return;
            
            addMessage(message, true);
            chatInput.value = '';
            
            // Simple response logic
            setTimeout(() => {
                let response = "I'm here to help with plant care! Ask me about watering, sunlight, fertilizer, pests, or repotting.";
                
                for (const [key, value] of Object.entries(responses)) {
                    if (message.includes(key)) {
                        response = value;
                        break;
                    }
                }
                
                addMessage(response);
            }, 1000);
        }
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', handleChatInput);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleChatInput();
            });
        }
    }
}

// Newsletter Subscription
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate subscription
            const button = this.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<div class="loading"></div>';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                showNotification('Thanks for subscribing to our newsletter!');
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
}

// Enhanced plant loading with badges
function displayFeaturedPlants(plants) {
    const featuredPlantsContainer = document.getElementById('featuredPlants');
    
    if (featuredPlantsContainer) {
        // Get first 4 plants for featured section
        const featuredPlants = plants.slice(0, 4);
        
        featuredPlantsContainer.innerHTML = featuredPlants.map(plant => `
            <div class="plant-card">
                ${plant.isNew ? '<span class="plant-badge">New</span>' : ''}
                ${plant.isPopular ? '<span class="plant-badge" style="background: #ff6b6b;">Popular</span>' : ''}
                <img src="${plant.image}" alt="${plant.name}" loading="lazy">
                <div class="plant-info">
                    <h3>${plant.name}</h3>
                    <p class="scientific-name">${plant.scientificName}</p>
                    <div class="plant-details">
                        <div class="detail">
                            <span class="label"><i class="fas fa-tint"></i> Water:</span>
                            <span>${plant.wateringFrequency}</span>
                        </div>
                        <div class="detail">
                            <span class="label"><i class="fas fa-sun"></i> Light:</span>
                            <span>${plant.sunlight}</span>
                        </div>
                    </div>
                    <div class="plant-actions">
                        <a href="plants.html" class="btn btn-primary">Learn More</a>
                        <button class="btn btn-secondary quick-view" data-plant='${JSON.stringify(plant)}'>
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add quick view functionality
        document.querySelectorAll('.quick-view').forEach(button => {
            button.addEventListener('click', function() {
                const plant = JSON.parse(this.dataset.plant);
                showQuickView(plant);
            });
        });
    }
}

// Quick View Modal
function showQuickView(plant) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${plant.name}</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <img src="${plant.image}" alt="${plant.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                <p><strong>Scientific Name:</strong> ${plant.scientificName}</p>
                <p><strong>Type:</strong> ${plant.type}</p>
                <p><strong>Watering:</strong> ${plant.wateringFrequency}</p>
                <p><strong>Sunlight:</strong> ${plant.sunlight}</p>
                <p><strong>Soil:</strong> ${plant.soil}</p>
                <p>${plant.description}</p>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="addToGardenFromQuickView('${plant.name}')">
                        <i class="fas fa-plus"></i> Add to My Garden
                    </button>
                    <a href="plants.html" class="btn btn-secondary">View Details</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function addToGardenFromQuickView(plantName) {
    // This would be implemented with your existing addToGarden function
    showNotification(`${plantName} added to your garden!`);
}

// Update the initializeApp function
function initializeApp() {
    setupNavigation();
    setupDarkMode();
    setupCart();
    loadFeaturedPlants();
    setupSmoothScroll();
    setupAnimations();
    initHeroSlideshow();
    initQuickActions();
    initNewsletter();
    
    // Add seasonal class to body for seasonal styling
    const season = getCurrentSeason();
    document.body.classList.add(`season-${season}`);
}

// Get current season
function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);