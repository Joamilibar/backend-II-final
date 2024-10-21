
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const socket = io();
    let products = [];

    // Emitir mensaje inicial
    socket.emit('message', 'Conectado al WebSocket');


    form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        // Obteniendo valores de los inputs
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const code = document.getElementById('code').value;
        const stock = document.getElementById('stock').value;
        const category = document.getElementById('category').value;


        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = {
            id: newId,
            title: title,
            price: price,
            description: description,
            code: code,
            stock: stock,
            category: category
        };

        console.log('Enviando nuevo producto', newProduct)
        // Enviando datos por WebSockets
        socket.emit('addProduct', newProduct);


        // Limpiando formulario
        form.reset();

    });

    // Función para renderizar productos
    function renderProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('li');
            productElement.innerHTML = `
            <strong>${product.title}</strong>
                - $${product.price}<br />
                Descripción: ${product.description}<br />
                Código: ${product.code}<br />
                Stock: ${product.stock}<br />
                Categoría: ${product.category}
                <button class="delete-button" data-id="${product.id}">Eliminar</button>
        `;
            productList.appendChild(productElement);
        });


        // Agregar event listeners a los botones de eliminación
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (evt) => {
                const productId = await evt.target.getAttribute('data-id');
                console.log('Eliminando producto con id', productId);
                socket.emit('deleteProduct', productId);
            });
        });
    }

    // Escuchar el evento de actualización de productos desde el servidor

    socket.on('productUpdate', async (updatedProducts) => {
        console.log('Actualizando productos', updatedProducts);
        products = await updatedProducts;
        renderProducts();
        //socketServer.emit('productUpdate', products);
    });

    // Escuchar el evento de eliminación de productos desde el servidor
    socket.on('productDeleted', async (deletedProductId) => {
        console.log('Producto eliminado con id', deletedProductId);
        products = await products.filter(product => product.id !== parseInt(deletedProductId));
        renderProducts();
    });


});

