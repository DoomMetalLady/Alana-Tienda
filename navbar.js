/* ==========================================================================
   NAVBAR.JS
   Se encarga de:
   1. Abrir/cerrar el menú de categorías en pantallas chicas.
   2. Mantener actualizado el numerito del carrito en el header,
      en TODAS las páginas (por eso se carga siempre, junto al footer).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    inicializarMenuMobile();
    actualizarContadorCarrito();
});

// Si productos.js o main.js modifican el carrito, avisan con este evento.
document.addEventListener("carrito-actualizado", actualizarContadorCarrito);

function inicializarMenuMobile() {
    const boton = document.getElementById("btn-menu");
    const nav = document.getElementById("nav-principal");
    if (!boton || !nav) return;

    boton.addEventListener("click", () => {
        const abierto = nav.classList.toggle("abierto");
        boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
}

/**
 * Lee el carrito de localStorage y actualiza el número que se ve
 * al lado del ícono del carrito en el header.
 */
function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (!contador) return;

    const datos = localStorage.getItem("alanaCarrito");
    const carrito = datos ? JSON.parse(datos) : [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    contador.textContent = totalItems;
}
