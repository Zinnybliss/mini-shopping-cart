const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const itemCountElement = document.getElementById('item-count'); // For item count
const totalAmountElement = document.getElementById('total-amount'); // For total amount
const orderConfirmationCard = document.getElementById('orderConfirmationCard'); // Confirmation card
const orderedItemsList = document.getElementById('orderedItemsList');
const finalTotalElement = document.getElementById('finalTotal');
const confirmDeliveryButton = document.querySelector('.confirm-delivery');

let cart = []; // Array to hold cart items

// Function to handle Add to Cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card'); // Get the parent product card
    const productImage = productCard.querySelector('img').src;
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));

    // Check if item already exists in the cart
    const cartItem = cart.find(item => item.name === productName);
    if (cartItem) {
      // If item exists, increase quantity
      cartItem.quantity += 1;
    } else {
      // Add new item with quantity 1
      cart.push({
        image: productImage,
        name: productName,
        price: productPrice,
        quantity: 1
      });
    }

    renderCartItems(); // Render items to cart section
    updateCartItemCount(); // Update item count
    updateCartTotal(); // Update total amount
  });
});

// Function to render cart items
function renderCartItems() {
  cartItemsContainer.innerHTML = ''; // Clear existing items
  orderedItemsList.innerHTML = ''; // Clear ordered items list in confirmation card

  if (cart.length === 0) {
    const emptyCartImage = document.createElement('img');
    emptyCartImage.src = 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1727086095/illustration-empty-cart_uaglyx.svg';
    emptyCartImage.alt = 'Empty Cart';
    emptyCartImage.style.width = '200px';
    emptyCartImage.style.display = 'block';
    emptyCartImage.style.margin = '0 auto';

    const emptyCartText = document.createElement('p');
    emptyCartText.textContent = 'Your added items will appear here';
    emptyCartText.style.textAlign = 'center';
    emptyCartText.style.color = '#b86a1e'; // Light brown color
    emptyCartText.style.fontSize = '0.7em';

    cartItemsContainer.appendChild(emptyCartImage);
    cartItemsContainer.appendChild(emptyCartText);
    finalTotalElement.textContent = '0.00'; // Reset total in confirmation card
  } else {
    let total = 0;
    cart.forEach((item, index) => {
      const itemTotalPrice = (item.price * item.quantity).toFixed(2);

      const cartItemDiv = document.createElement('div');
      cartItemDiv.classList.add('cart-item');
      cartItemDiv.style.display = 'flex';
      cartItemDiv.style.justifyContent = 'space-between';
      cartItemDiv.style.alignItems = 'center';
      cartItemDiv.style.marginBottom = '10px';

      const img = document.createElement('img');
      img.src = item.image;
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'cover';

      const infoDiv = document.createElement('div');
      infoDiv.style.flex = '1';
      infoDiv.style.marginLeft = '10px';
      infoDiv.innerHTML = `<h3 style="font-size: 0.9em;">${item.name}</h3><p style="color: #b86a1e;">$${itemTotalPrice} (${item.quantity}x)</p>`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✖';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.backgroundColor = 'transparent';
      removeBtn.style.border = 'none';
      removeBtn.style.color = '#b86a1e';
      removeBtn.style.fontSize = '1.5em';

      removeBtn.addEventListener('click', () => {
        removeCartItem(index);
      });

      cartItemDiv.appendChild(img);
      cartItemDiv.appendChild(infoDiv);
      cartItemDiv.appendChild(removeBtn);
      cartItemsContainer.appendChild(cartItemDiv);

      const orderedItemListItem = document.createElement('li');
      orderedItemListItem.innerHTML = `<img src="${item.image}" style="width: 30px; height: 30px; object-fit: cover; margin-right: 10px;"> ${item.name} - $${itemTotalPrice} (${item.quantity}x)`;
      orderedItemsList.appendChild(orderedItemListItem);

      total += parseFloat(itemTotalPrice);
    });

    finalTotalElement.textContent = total.toFixed(2); // Update total in the confirmation card
  }
}

// Function to remove item from cart
function removeCartItem(index) {
  cart.splice(index, 1); // Remove item from array
  renderCartItems(); // Re-render items
  updateCartItemCount(); // Update item count
  updateCartTotal(); // Update total amount
}

// Function to update the cart item count
function updateCartItemCount() {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  itemCountElement.textContent = totalQuantity;
}

// Function to update the total cart price
function updateCartTotal() {
  let total = cart.reduce((accum, item) => accum + item.price * item.quantity, 0);
  totalAmountElement.textContent = total.toFixed(2); // Update total amount in the span
}

// Show confirmation card when 'Confirm Delivery' is clicked
confirmDeliveryButton.addEventListener('click', () => {
  if (cart.length > 0) {
    orderConfirmationCard.style.display = 'block'; // Show confirmation card
  } else {
    alert('Your cart is empty!');
  }
});

// Confirm Order Button functionality
document.getElementById('confirm-order').addEventListener('click', () => {
  alert('Order has been confirmed! Thank you for your purchase.');
  cart = []; // Clear cart after confirmation
  renderCartItems(); // Reset cart display
  orderConfirmationCard.style.display = 'none'; // Hide confirmation card
});