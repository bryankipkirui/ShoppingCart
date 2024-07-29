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
]

for(let i = 0; i < carts.length; i++) {
    carts[i].addEventListener("click",() => {
        addToCart(products[i]);
        totalCost(products[i]);
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem ('cartnumber');

    if(productNumbers){
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

function addToCart(product) {
    let productNumbers  = localStorage.getItem('cartnumber');

    productNumbers = parseInt(productNumbers);

    if(productNumbers){
        alert("product already in carrt")
        // localStorage.setItem('cartnumber', productNumbers + 1);
        // document.querySelector('.cart span').textContent = productNumbers + 1;
    }
    else{
        localStorage.setItem('cartnumber', 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItem(product);
}

function setItem(product){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null){
        if (cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                    [product.tag]:product
            }
        }
        cartItems[product.tag].inCart += 1;
    }
    else{
        product.inCart = 1;
        cartItems = {
           [product.tag]: product
       }    
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

function totalCost(product){
let cartCost = localStorage.getItem('totalCost');
    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price);
    }
    else{
        localStorage.setItem('totalCost', product.price);
    }
}
function dispalyCart(){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');

    if(cartItems && productContainer){
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <i class="fa fa-times-circle remove" data-tag="${item.tag}"></i>
                <img src="./images/${item.tag}.jpg">
                <span>${item.name}</span>
            </div>
            <div class="price">$${item.price}.00</div>
            <div class="quantity">
                <i class="fa fa-caret-left decrease" data-tag="${item.tag}"></i>
                <span>${item.inCart}</span>
                <i class="fa fa-caret-right increase" data-tag="${item.tag}"></i>
            </div>
            <div class="total">
                $${item.inCart * item.price}.00
            </div>
            `
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTitle">Basket Total</h4>
                <h4 class="basketTotal">$${cartCost}.00</h4>
        `;

        //adding event listeners for increase and decrease icons
        const decreaseButton = document.querySelectorAll('.decrease');
        const increaseButton = document.querySelectorAll('.increase');
        const removeButton = document.querySelectorAll('.remove');

        decreaseButton.forEach((button)=>{
            button.addEventListener('click', ()=>{
                const tag = button.getAttribute('data-tag');
                updateCart(tag, 'decrease');
            });
        });

        increaseButton.forEach((button)=>{
            button.addEventListener('click', ()=>{
                const tag = button.getAttribute('data-tag');
                updateCart(tag, 'increase');
            });
        });

        removeButton.forEach((button)=>{
            button.addEventListener('click', ()=>{
                const tag = button.getAttribute('data-tag');
                removeFromCart(tag);
            });
        });
    }
}

function updateCart(tag,action){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    let cartCost = parseInt(localStorage.getItem('totalCost'));
    // console.log(cartItems);

    if (action === 'increase'){
        cartItems[tag].inCart += 1;
        cartCost += cartItems[tag].price
    }
    else if (action === 'decrease'){
        if(cartItems[tag].inCart > 1){
            cartItems[tag].inCart -= 1;
            cartCost -= cartItems[tag].price;
        }
    }
    else{
        removeFromCart(tag);
        return; //exit function after removal
    }

localStorage.setItem('productsInCart',JSON.stringify(cartItems));
localStorage.setItem('totalCost', cartCost);
dispalyCart(); //refresh cart display

}




function removeFromCart(tag){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || [];
    let cartCost = parseInt(localStorage.getItem('totalCost')) || 0;
    let cartnumber = parseInt(localStorage.getItem('cartnumber'));

    console.log("cartnumber", cartnumber)
    console.log("tag", tag)

    //remove item from cart
    if(cartItems[tag]){
        cartCost -= (cartItems[tag].inCart * cartItems[tag].price);
        cartnumber -= 1;
    }
    delete cartItems[tag];

       
    if(Object.keys(cartItems).length === 0){
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));
        localStorage.setItem('totalCost', cartCost);
        localStorage.setItem('cartnumber', cartnumber);
    }
    
    else{
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));
        localStorage.setItem('totalCost', cartCost);
        localStorage.setItem('cartnumber', cartnumber);
    }

    // if(localStorage.length == 0){
    //     localStorage.clear
    // }


    onLoadCartNumbers();
    dispalyCart(); //refresh the cart display


}

onLoadCartNumbers();
dispalyCart();
