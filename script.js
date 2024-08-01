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
        // totalCost(products[i]);
    })
}

function getProductsCount(){
    let itemCountDisplay =  document.querySelector('.cart span');
    let count = 0;
    let productsInCart = localStorage.getItem('productsInCart');
    if(!productsInCart){
        count = 0;
    }
    else{
        productsInCart = JSON.parse(productsInCart);
        count = productsInCart?.length;
    }
    itemCountDisplay.textContent = count;
}

function addToCart(product) {

    // let productsCount = document.querySelector('.cart span');
    const cartArray = []; //declaring an empty array
    let cartProducts = localStorage.getItem("productsInCart");


     //if there is no products in the cart
    if(!cartProducts){
        product.inCart = 1; //setting the initial quantity
        product.totalprice = product.price * product.inCart;
        cartArray.push(product); //push products into the new array declared
        localStorage.setItem("productsInCart", JSON.stringify(cartArray));// store the array of elements into the local storage
        
    }else{
        // if there is a product in the cart
        let productId = product?.id; // getting product ID
        let exisitngCart = JSON.parse(cartProducts);
        let newExistingProduct = [...exisitngCart]
        let findIndex = newExistingProduct.findIndex((item) => item.id === productId); //find index of a product in the array newExistingProduct

        //if the product is not already in the cart
        if(findIndex === -1){ 
            product.inCart = 1;//set initial quantity
            product.totalprice = product.price * product.inCart;
            newExistingProduct.push(product); //add new product
       
        }else{
            //if the product is already in the cart
            let existingProduct = newExistingProduct[findIndex]; //get the existing product
            existingProduct.inCart ++; // inccrement the quantity
            product.totalprice = product.price * existingProduct.inCart;
        }

        //update the local storage with the modified cart
        localStorage.setItem("productsInCart", JSON.stringify(newExistingProduct) );
        getProductsCount();
    }
    //stroring the cart count in the local storage and updating the UI
  //Update displayed cart count


}


// function totalCost(product){
// let cartCost = localStorage.getItem('totalCost');
//     if(cartCost != null){
//         cartCost = parseInt(cartCost);
//         localStorage.setItem('totalCost', cartCost + product.price);
//     }
//     else{
//         localStorage.setItem('totalCost', product.price);
//     }
// }

function displayCart(){
    let cartItems = localStorage.getItem('productsInCart'); // getting the products from local storage
    cartItems = JSON.parse(cartItems); //converting the products into javascript object
    let productContainer = document.querySelector('.products'); //capturing the HTML element with the class (products)
    let cartCost = 0; //getting the total cost of the products from localStorage

    cartCost = cartItems.reduce((total, curr) => {
      
        return total +=  curr?.totalprice
    },0 )
    if(cartItems && productContainer){
        productContainer.innerHTML = ''; // clearing the container before displaying items

        //iterating through each item in the cart
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
        //displaying the total cost of the cart
        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTitle">Basket Total</h4>
                <h4 class="basketTotal">$${cartCost}.00</h4>
            </div>
        `;

        // adding event listeners for increase and decrease icons
        const decreaseButton = document.querySelectorAll('.decrease');
        const increaseButton = document.querySelectorAll('.increase');
        const removeButton = document.querySelectorAll('.remove');

        //iterating over each buttons
        decreaseButton.forEach((button)=>{
            button.addEventListener('click', ()=>{
                const tag = button.getAttribute('data-tag'); //retrieving the value of the data  tag from the button
                updateCart(tag, 'decrease');  //calling the update function to decrease the quantity
            });
        });
        
        increaseButton.forEach((button)=>{
            button.addEventListener('click', ()=>{
                const tag = button.getAttribute('data-tag');
                updateCart(tag, 'increase'); //calling the update function to increase the quantity 
            });
        });

        removeButton.forEach((button)=>{
            button.addEventListener('click', ()=>{
                const tag = button.getAttribute('data-tag');
                removeFromCart(tag); //calling the removeCart function to remove the item
            });
        });
    }
}

window.addEventListener( "addToCart", function(){
    displayCart();
})

function updateCart(tag,action){


    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));//retrieve and parse cart items from localStorage
    let newCartItems = [...cartItems]
    // console.log(cartItems);
    // let cartCost = parseInt(localStorage.getItem('totalCost'));// retrive and parse total cost of the cart items from local storage
    // console.log(cartItems);
    let findIndex = newCartItems?.findIndex((item) => item?.tag === tag)

    let currentProduct = newCartItems[findIndex]
    let currentinCart = currentProduct?.inCart
    
    if(action === "increase"){
        currentinCart ++
        currentProduct.inCart = currentinCart
        currentProduct.totalprice = currentProduct.price * currentinCart
    }else{

        if(currentinCart === 1){
            removeFromCart(tag);
            return
        }
        currentinCart --
        currentProduct.inCart = currentinCart
        currentProduct.totalprice = currentProduct.price * currentinCart

    }
    localStorage.setItem("productsInCart", JSON.stringify(newCartItems))
    let event = new Event("addToCart")
    window.dispatchEvent(event)
}




function removeFromCart(tag){
    let cartItems = JSON.parse(localStorage.getItem('productsInCart')) || [];
    let newCartItem = [...cartItems];

    let findIndex = newCartItem.findIndex((item)=> item?.tag === tag);
    newCartItem.splice(findIndex, 1)
    localStorage.setItem("productsInCart", JSON.stringify(newCartItem))
    let event = new Event("addToCart");
    window.dispatchEvent(event);


    displayCart(); //refresh the cart display
    getProductsCount();


}


displayCart();
getProductsCount();