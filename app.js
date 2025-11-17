// OCP Principle Implementation
// Base Strategy Interface (Open for extension, closed for modification)
class DiscountStrategy {
    apply(order) {
        throw new Error("apply() method must be implemented");
    }
}

// Concrete Strategy Implementations
class NoDiscount extends DiscountStrategy {
    apply(order) {
        return 0;
    }
}

class BlackFridayDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.5; // 50% off
    }
}

class MemberDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.1; // 10% off
    }
}

class StudentDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.2; // 20% off
    }
}

class SeniorDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.15; // 15% off
    }
}

// Order class
class Order {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    addItem(name, price) {
        this.items.push({ name, price });
        this.total += price;
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}

// Checkout system using polymorphism (OCP principle in action)
function applyDiscount(order, strategy) {
    return strategy.apply(order);
}

// Sample products
const products = [
    { name: "Laptop", price: 999.99 },
    { name: "Mouse", price: 29.99 },
    { name: "Keyboard", price: 79.99 },
    { name: "Monitor", price: 249.99 },
    { name: "Webcam", price: 49.99 }
];

// Initialize the application
let currentOrder = new Order();
let currentStrategy = new NoDiscount();

// DOM elements
const productList = document.getElementById('productList');
const discountSelect = document.getElementById('discountSelect');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');

// Strategy factory
function getDiscountStrategy(type) {
    switch(type) {
        case 'blackfriday':
            return new BlackFridayDiscount();
        case 'member':
            return new MemberDiscount();
        case 'student':
            return new StudentDiscount();
        case 'senior':
            return new SeniorDiscount();
        default:
            return new NoDiscount();
    }
}

// Render products
function renderProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price.toFixed(2)}</span>
        `;
        productList.appendChild(productItem);
    });
}

// Update order
function updateOrder() {
    currentOrder = new Order();
    products.forEach(product => {
        currentOrder.addItem(product.name, product.price);
    });
    updateSummary();
}

// Update summary display
function updateSummary() {
    const subtotal = currentOrder.total;
    const discountAmount = applyDiscount(currentOrder, currentStrategy);
    const total = subtotal - discountAmount;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discountAmount.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Event listeners
discountSelect.addEventListener('change', (e) => {
    currentStrategy = getDiscountStrategy(e.target.value);
    updateSummary();
});

// Initialize
renderProducts();
updateOrder();

