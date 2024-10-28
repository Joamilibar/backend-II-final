async function addProductToCart(cartId, productId, quantity) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1 })
        });

        const result = await response.json();
        console.log('Resultado de agregar producto al carrito:', result);

        if (result.status === 'success') {
            alert('Producto agregado al carrito');
            window.location.href = `/carts/${cartId}`;

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

        const userResponse = await fetch('/api/sessions/current');
        console.log('userResponse:', userResponse);
        if (!userResponse.ok) {
            throw new Error('No se pudo obtener la información del usuario.');
        }

        const userData = await userResponse.json();
        console.log('userData:', userData);


        cartId = userData.cartId;
        console.log('cartId:', cartId);

    } catch (error) {
        console.error('Error al obtener el cartId del usuario:', error);
        return;
    }

    const cartButtons = document.querySelectorAll('.add-to-cart');

    cartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            if (cartId) {
                await addProductToCart(cartId, productId);
            } else {
                alert('No se puede agregar el producto. El carrito no está disponible.');
            }
        });
    });
});
