document.addEventListener('DOMContentLoaded', () => {
    const purchaseButton = document.getElementById('purchaseButton');
    const purchaseMessage = document.getElementById('purchaseMessage');
    const cartId = window.location.pathname.split('/')[2];

    purchaseButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartId: 'id_del_carrito',
                    productId: 'id_del_producto',
                    quantity: 1,
                }),
            });

            // Asegúrate de que el response sea exitoso
            if (!response.ok) {
                const errorData = await response.json(); // Maneja error de respuesta
                throw new Error(errorData.message || 'Error desconocido');
            }

            const data = await response.json();

            // Manejo de compra exitosa
            if (data.success) { // Cambié 'data.status === 'success'' por 'data.success' para alinearse con el backend
                purchaseMessage.innerHTML = `<p style="color: green;">Compra finalizada con éxito. Tu ticket ha sido generado.</p>`;
            } else {
                // Manejo de productos no comprados
                const notPurchasedProducts = data.unprocessedIds; // Cambié 'data.notPurchased' a 'data.unprocessedIds'
                if (notPurchasedProducts.length > 0) {
                    purchaseMessage.innerHTML = `
                        <p style="color: red;">Compra incompleta. Los siguientes productos no se pudieron comprar:</p>
                        <ul>${notPurchasedProducts.map(id => `<li>${id}</li>`).join('')}</ul>
                    `;
                } else {
                    purchaseMessage.innerHTML = `<p style="color: red;">Error al procesar la compra. Intenta nuevamente.</p>`;
                }
            }
        } catch (error) {
            purchaseMessage.innerHTML = `<p style="color: red;">Error al procesar la compra: ${error.message}</p>`;
        }
    });
});
