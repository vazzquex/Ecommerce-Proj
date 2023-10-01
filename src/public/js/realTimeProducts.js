const socket = io();

// Create Products
const form = document.getElementById('form');
const titleInput = document.getElementById('titleInput');
const priceInput = document.getElementById('priceInput');
const stockInput = document.getElementById('stockInput');
const descripInput = document.getElementById('descripInput');
const statusInput = document.getElementById('statusInput');
const categoryInput = document.getElementById('categoryInput');

const userEmail = document.getElementById('userEmail');

const thumbnailInput = document.getElementById('thumbnailInput');

form.addEventListener('submit', (data) => {
    data.preventDefault();

    const newProduct = {
        title: titleInput.value,
        description: descripInput.value,
        price: priceInput.value,
        category: categoryInput.value,
        status: statusInput.checked, 
        stock: stockInput.value,
        email: userEmail.value,
        thumbnail: thumbnailInput.value,
    };

    socket.emit('newProduct', newProduct);
    form.reset();
});

// Load products
socket.on('products', (products) => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.docs.forEach((product) => {
        const productCard = `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">$${product.price}</p>
                        <p class="card-text">ID: ${product._id}</p>
                        <p class="card-text">Owner: ${product.owner}</p>
                        <p class="card-text">Stock: ${product.stock}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        productsContainer.innerHTML += productCard;
    });
});

// Eliminar productos:
const deleteForm = document.getElementById('deleteForm');
const idInput = document.getElementById('idInput');
const deleteInput = document.getElementById('deleteInput');

deleteForm.addEventListener('submit', (data) => {
    data.preventDefault();

    const productToDelete = {
        id: idInput.value,
        email: userEmail.value
  };

    socket.emit('deleteProduct', productToDelete);

    deleteForm.reset();
});


socket.on('deleteResult', (result) => {
    if (result.success) {
      Swal.fire(
        'Success',
        result.message,
        'success'
      )
    } else {
      Swal.fire(
        'Error',
        result.message,
        'error'
      )
    }
  });
  

  socket.on('createdResoult', (result) => {
    if (result.success) {
      Swal.fire(
        'Success',
        result.message,
        'success'
      )
    } else {
      Swal.fire(
        'Error',
        result.message,
        'error'
      )
    }
  });