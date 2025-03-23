const addToCartButtons = document.querySelectorAll('.menu-item button');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.parentElement;
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = parseFloat(menuItem.querySelector('p').textContent.replace('$', ''));
        addToCart(itemName, itemPrice);
    });
});

const familyComboButton = document.querySelector('.deal button.add-to-cart');
familyComboButton.addEventListener('click', () => {
    const deal = familyComboButton.parentElement;
    const itemName = deal.querySelector('h3').textContent;
    const itemPrice = parseFloat(familyComboButton.dataset.price);
    addToCart(itemName, itemPrice);
});

const customizeButton = document.getElementById('Customize_button');
customizeButton.addEventListener('click', (event) => {
    event.preventDefault();
    const base = document.getElementById('base').value;
    const toppings = Array.from(document.querySelectorAll('#toppings_checkbox input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    const size = document.getElementById('size').value;

    const itemName = `Custom Pizza (${size}, ${base}, ${toppings.join(', ')})`;
    let itemPrice = 10;
    toppings.forEach(topping => {
        switch (topping) {
            case 'Pepperoni': itemPrice += 1; break;
            case 'Mushrooms': itemPrice += 0.75; break;
            case 'Onions': itemPrice += 0.50; break;
            case 'Sausage': itemPrice += 1.25; break;
        }
    });

    switch (size) {
        case 'Medium': itemPrice *= 1.25; break;
        case 'Large': itemPrice *= 1.5; break;
        case 'X-Large': itemPrice *= 1.75; break;
    }

    addToCart(itemName, itemPrice);
});

const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total');
const cartCounter = document.getElementById('cart-counter');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(itemName, itemPrice) {
    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }

    updateCartDisplay();
    updateCartCounter();
    saveCart();
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="quantity-button decrease" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                <span>${item.quantity}</span>
                <button class="quantity-button increase">+</button>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-button">Remove</button></td>
        `;

        const decreaseButton = row.querySelector('.decrease');
        const increaseButton = row.querySelector('.increase');
        const removeButton = row.querySelector('.remove-button');

        decreaseButton.addEventListener('click', () => {
            item.quantity--;
            if (item.quantity === 0) {
                removeItem(item.name);
            } else {
                updateCartDisplay();
            }
        });

        increaseButton.addEventListener('click', () => {
            item.quantity++;
            updateCartDisplay();
        });

        removeButton.addEventListener('click', () => {
            removeItem(item.name);
        });

        cartItemsContainer.appendChild(row);
    });

    updateCartTotal();
}

function removeItem(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
    updateCartCounter();
    saveCart();
}

function updateCartTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    cartTotalElement.textContent = total.toFixed(2);
}

function updateCartCounter() {
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    cartCounter.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCounter();
    }
}

loadCart();

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.addEventListener('click', () => {
    alert('checkout succesfull....');

    cart = [];
    updateCartDisplay();
    updateCartCounter();
    saveCart();
});

updateCartCounter();

const selectAllButton = document.getElementById('selectall');
selectAllButton.addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('#toppings_checkbox input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
  });
});
