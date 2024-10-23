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
        console.log('userData:', userData);
        cartId = userData.email.cartId;  // El cartId del usuario
        console.log('cartId:', cartId);

        if (!cartId) {
            console.log('El usuario no tiene un carrito asignado.');
        }
    } catch (error) {
        console.error('Error al obtener el cartId del usuario:', error);
        return;
    }

    /* document.addEventListener('DOMContentLoaded', async () => {
        let cartId;
        try {
            const userResponse = await fetch('/api/sessions/current');
            if (!userResponse.ok) {
                throw new Error('No se pudo obtener la información del usuario.');
            }

            const userData = await userResponse.json();
            console.log('userData:', userData);

            cartId = userData.cart ? userData.cart : null;  // Verifica si existe el carrito
            console.log('cartId:', cartId);

            if (!cartId) {
                console.log('El usuario no tiene un carrito asignado.');
                alert('No tienes un carrito disponible. Por favor, crea uno antes de agregar productos.');
            }
        } catch (error) {
            console.error('Error al obtener el cartId del usuario:', error);
            return;
        } */

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
//});
