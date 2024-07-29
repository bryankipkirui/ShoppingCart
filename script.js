let carts = document.querySelectorAll(".btn");

let products = [
    {   
        id: 1,
        name: "GreyBlack Hoodie",
        tag: "hoodie",
        price: 20.00,
        inCart: 0
    },
    {   
        id: 2,
        name: "BluePink Hoodie",
        tag: "hoodie1",
        price: 22.0,
        inCart: 0
    },
    {
        id: 3,
        name: "White Hoodie",
        tag: "hoodie2",
        price: 24.0,
        inCart: 0
    },
    {
        id: 4,
        name: "White SweatShirt",
        tag: "hoodie3",
        price: 18.00,
        inCart: 0
    }
];

for(let i = 0; i < carts.length; i++) {
    carts[i].addEventListener("click", () => {
        addToCart(products[i]);
        updateTotalCost();
    });
}

function updateCartDisplay() {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || {};
    let totalItems = Object.values(cartItems).reduce((total, item) => total + item.inCart, 0);
    document.querySelector('.cart span').textContent = totalItems;
}

function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || {};

    if(cartItems[product.tag]) {
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems[product.tag] = product;
    }
    
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
    updateCartDisplay();
}

function updateTotalCost() {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || {};
    let totalCost = Object.values(cartItems).reduce((total, item) => {
        return total + (item.price * item.inCart);
    }, 0);
    localStorage.setItem('totalCost', totalCost.toFixed(2));
}

function displayCart() {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || {};
    let productContainer = document.querySelector('.products');
    let cartCost = parseFloat(localStorage.getItem('totalCost')) || 0;

    if(Object.keys(cartItems).length > 0 && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).forEach(item => {
            productContainer.innerHTML += `
            <div class="product">
                <i class="fa fa-times-circle remove" data-tag="${item.tag}"></i>
                <img src="./images/${item.tag}.jpg">
                <span>${item.name}</span>
            </div>
            <div class="price">$${item.price.toFixed(2)}</div>
            <div class="quantity">
                <i class="fa fa-caret-left decrease" data-tag="${item.tag}"></i>
                <span>${item.inCart}</span>
                <i class="fa fa-caret-right increase" data-tag="${item.tag}"></i>
            </div>
            <div class="total">
                $${(item.inCart * item.price).toFixed(2)}
            </div>
            `;
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTitle">Basket Total</h4>
                <h4 class="basketTotal">$${cartCost.toFixed(2)}</h4>
            </div>
        `;

        addEventListeners();
    } else if (productContainer) {
        productContainer.innerHTML = '<p>Your cart is empty</p>';
    }
    updateCartDisplay();
}

function addEventListeners() {
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag');
            updateCart(tag, 'decrease');
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag');
            updateCart(tag, 'increase');
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag');
            removeFromCart(tag);
        });
    });
}

function updateCart(tag, action) {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    
    if (action === 'increase') {
        cartItems[tag].inCart += 1;
    } else if (action === 'decrease') {
        if (cartItems[tag].inCart > 1) {
            cartItems[tag].inCart -= 1;
        } else {
            removeFromCart(tag);
            return;
        }
    }

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
    updateTotalCost();
    displayCart();
}

function removeFromCart(tag) {
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || {};

    if (cartItems[tag]) {
        delete cartItems[tag];
    }

    if (Object.keys(cartItems).length === 0) {
        localStorage.removeItem('productsInCart');
        localStorage.removeItem('totalCost');
    } else {
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));
    }

    updateTotalCost();
    displayCart();
}

updateCartDisplay();
displayCart();