// Cart data
let cart = [];

// Load cart from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    renderCart();
});

// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

// Navigate to page
function navigateTo(page) {
    showPage(page);
    // Close mobile menu after navigation
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.remove("active");
}

// Show page
function showPage(page) {
    const pages = ["home", "cakes", "snacks", "contact-info", "contact-form", "cart"];
    pages.forEach((p) => {
        const element = document.getElementById(p + "-page");
        if (element) {
            element.classList.add("hidden");
        }
    });

    const targetPage = document.getElementById(page + "-page");
    if (targetPage) {
        targetPage.classList.remove("hidden");
    }

    // Render cart if navigating to cart page
    if (page === 'cart') {
        renderCart();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Add item to cart
function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show feedback
    showAddToCartFeedback(name);
}

// Show add to cart feedback
function showAddToCartFeedback(itemName) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #d9a15c, #c07a40);
        color: #2c1812;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        z-index: 10000;
        font-weight: 700;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `✓ ${itemName} added to cart!`;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update item quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartCount();
    renderCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('venusCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('venusCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Render cart items
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Your cart is empty</p>
                <a href="#" class="btn" onclick="showPage('cakes')">Start Shopping</a>
            </div>
        `;
    } else {
        let cartHTML = '';
        
        cart.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${item.price} each</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')" title="Remove item">×</button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
    }
    
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const delivery = cart.length > 0 ? 50 : 0;
    const total = subtotal + tax + delivery;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('delivery').textContent = `₹${delivery}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 
                  (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05) + 50;
    
    // Create order summary
    let orderSummary = 'ORDER SUMMARY\n\n';
    cart.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderSummary += `\nTotal: ₹${total.toFixed(2)}`;
    
    alert(`Thank you for your order!\n\n${orderSummary}\n\nWe will contact you shortly to confirm your order.`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
}

// Handle contact form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value || 'Not provided';
    const subject = document.getElementById('subject') ? document.getElementById('subject').value : 'General Inquiry';
    const message = document.getElementById('message').value;
    
    // Get current date and time
    const now = new Date();
    const dateTime = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Create contact data string
    const contactData = `
=================================================
VENUS BAKE HOUSE - CONTACT FORM SUBMISSION
=================================================

Date & Time: ${dateTime}

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

=================================================
`;
    
    // Save to localStorage
    saveContactSubmission(contactData);
    
    // Create downloadable text file
    downloadContactData(contactData, `contact_${Date.now()}.txt`);
    
    alert("Thank you for your message! We will get back to you soon.\n\nYour contact information has been saved and downloaded.");
    e.target.reset();
}

// Save contact submission to localStorage
function saveContactSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
        timestamp: Date.now(),
        data: data
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// Download contact data as text file
function downloadContactData(data, filename) {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
