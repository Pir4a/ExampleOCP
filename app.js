/* ============================================
   ❌ MAUVAISE PRATIQUE - Violation du Principe OCP
   ============================================
   
   Cette approche nécessite la MODIFICATION du code existant
   pour ajouter de nouveaux types de remise. Cela viole le Principe Ouvert/Fermé.
   
   Problèmes:
   - Doit modifier la fonction applyDiscount à chaque ajout d'une nouvelle remise
   - Risque de casser les fonctionnalités existantes
   - Plus difficile de tester les types de remise individuellement
   - Violation du Principe de Responsabilité Unique
   - Pas évolutif

class Order {
    constructor() {
        this.items = [];
        this.total = 0;
    }
    addItem(name, price) {
        this.items.push({ name, price });
        this.total += price;
    }
}

// ❌ MAUVAIS: Fonction monolithique qui nécessite une modification pour chaque nouvelle remise
function applyDiscount(order, discountType) {
    // Pour ajouter une nouvelle remise, nous DEVONS modifier cette fonction
    if (discountType === 'blackfriday') {
        return order.total * 0.5;
    } else if (discountType === 'member') {
        return order.total * 0.1;
    } else if (discountType === 'student') {
        return order.total * 0.2;
    } else if (discountType === 'senior') {
        return order.total * 0.15;
    } else if (discountType === 'vip') {
        // ❌ Ajouter ceci nécessite de modifier la fonction existante !
        return order.total * 0.25;
    }
    return 0;
}

// Utilisation:
// const order = new Order();
// order.addItem("Laptop", 1000);
// const discount = applyDiscount(order, 'blackfriday');
// const total = order.total - discount;

============================================ */

// ============================================
// ✅ BONNE PRATIQUE - Respecte le Principe OCP
// ============================================
// Implémentation du Principe OCP
// Interface de Stratégie de Base (Ouvert pour l'extension, fermé pour la modification)
class DiscountStrategy {
    apply(order) {
        throw new Error("apply() method must be implemented");
    }
}

// Implémentations concrètes des Stratégies
class NoDiscount extends DiscountStrategy {
    apply(order) {
        return 0;
    }
}

class BlackFridayDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.5; // 50% de remise
    }
}

class MemberDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.1; // 10% de remise
    }
}

class StudentDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.2; // 20% de remise
    }
}

class SeniorDiscount extends DiscountStrategy {
    apply(order) {
        return order.total * 0.15; // 15% de remise
    }
}

// Classe Order
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

// Système de paiement utilisant le polymorphisme (principe OCP en action)
function applyDiscount(order, strategy) {
    return strategy.apply(order);
}

// Produits d'exemple
const products = [
    { name: "Laptop", price: 999.99 },
    { name: "Mouse", price: 29.99 },
    { name: "Keyboard", price: 79.99 },
    { name: "Monitor", price: 249.99 },
    { name: "Webcam", price: 49.99 }
];

// Initialiser l'application
let currentOrder = new Order();
let currentStrategy = new NoDiscount();

// Éléments DOM
const productList = document.getElementById('productList');
const discountSelect = document.getElementById('discountSelect');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');

// Factory de stratégies
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

// Afficher les produits
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

// Mettre à jour la commande
function updateOrder() {
    currentOrder = new Order();
    products.forEach(product => {
        currentOrder.addItem(product.name, product.price);
    });
    updateSummary();
}

// Mettre à jour l'affichage du résumé
function updateSummary() {
    const subtotal = currentOrder.total;
    const discountAmount = applyDiscount(currentOrder, currentStrategy);
    const total = subtotal - discountAmount;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discountAmount.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Écouteurs d'événements
discountSelect.addEventListener('change', (e) => {
    currentStrategy = getDiscountStrategy(e.target.value);
    updateSummary();
});

// Initialisation
renderProducts();
updateOrder();

