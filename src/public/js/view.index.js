async function addProductToCart(cartId, productId, quantity) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity }) // Se envía la cantidad por defecto (1)
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Producto agregado al carrito');
        } else {
            alert('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto al carrito');
    }
}

async function createCart(userId) {
    try {
        const response = await fetch('/api/carts', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        const result = await response.json();
        if (result.status === 'success') {
            return result.cartId;
        } else {
            alert('Error al crear el carrito');
            return null;
        }
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let cartId;
    try {
        // Hacemos la solicitud para obtener los datos del usuario actual
        const userResponse = await fetch('/api/sessions/current');  // Cambia la ruta aquí
        console.log('userResponse:', userResponse);
        if (!userResponse.ok) {
            throw new Error('No se pudo obtener la información del usuario.');
        }

        const userData = await userResponse.json();
        console.log('userData:', userData);

        // Verificamos si el cartId está presente en la respuesta
        cartId = userData.cartId;  // Accede al cartId directamente
        console.log('cartId:', cartId);

        /* if (!cartId) {
            console.log('El usuario no tiene un carrito asignado.');
            await CartController.createCart(userData._id);
            alert('No tienes un carrito disponible. Lo acabamos de crear.');
            return; // Salimos si no hay cartId
        } */
    } catch (error) {
        console.error('Error al obtener el cartId del usuario:', error);
        return;
    }

    // Seleccionamos los botones para agregar productos al carrito
    const cartButtons = document.querySelectorAll('.add-to-cart');

    cartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            if (cartId) {
                await addProductToCart(cartId, productId); // Llamamos a la función para agregar el producto
            } else {
                alert('No se puede agregar el producto. El carrito no está disponible.');
            }
        });
    });
});
