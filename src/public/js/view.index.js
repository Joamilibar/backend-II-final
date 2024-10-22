async function addProductToCart(cartId, productId) {
    try {
        const response = await fetch(`api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: 1 })
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

document.addEventListener('DOMContentLoaded', async () => {
    let cartId;
    try {
        const userResponse = await fetch('/api/sessions/current');
        const userData = await userResponse.json();
        cartId = userData.cartId;  // El cartId del usuario

        if (!cartId) {
            console.log('El usuario no tiene un carrito asignado.');
        }
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
            /* const cartButtons = document.querySelectorAll('.add-to-cart');
        
            cartButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const productId = event.target.getAttribute('data-id');
                    const cartId = fetch(${ cartId });
                    await addProductToCart(cartId, productId); */
        });
    });
});
