/* ==========================================================================
   MAIN.JS
   Utilidades generales que se reutilizan en más de una página del sitio
   (por eso viven acá y no en un archivo específico de una sola sección).

   Por ahora incluye:
   1. validarFormulario(): validación genérica de campos requeridos y
      formato de email, usada por el formulario de contacto (footer.js)
      y por los formularios de login/registro.
   ========================================================================== */

const CLAVE_CARRITO = "alanaCarrito";

function obtenerCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

/**
 * Valida un formulario según reglas simples basadas en atributos:
 * - Cualquier campo con "required" no puede estar vacío.
 * - Cualquier campo type="email" debe tener formato de correo válido.
 *
 * Muestra los mensajes de error debajo de cada campo (elemento con
 * clase "error-campo" ya presente en el HTML, al lado del input).
 *
 * @param {HTMLFormElement} formulario
 * @returns {boolean} true si el formulario es válido, false si no.
 */
function validarFormulario(formulario) {
    let esValido = true;
    const campos = formulario.querySelectorAll("[required]");

    campos.forEach((campo) => {
        limpiarError(campo);

        const valor = campo.value.trim();

        if (valor === "") {
            mostrarError(campo, "Este campo es obligatorio.");
            esValido = false;
            return;
        }

        if (campo.type === "email" && !formatoDeEmailValido(valor)) {
            mostrarError(campo, "Ingresá un correo electrónico válido.");
            esValido = false;
        }
    });

    return esValido;
}

function formatoDeEmailValido(valor) {
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronEmail.test(valor);
}

function mostrarError(campo, mensaje) {
    campo.classList.add("campo-invalido");
    campo.setAttribute("aria-invalid", "true");

    const contenedorError = campo.closest(".grupo-formulario")?.querySelector(".error-campo");
    if (contenedorError) {
        contenedorError.textContent = mensaje;
    }
}

function limpiarError(campo) {
    campo.classList.remove("campo-invalido");
    campo.removeAttribute("aria-invalid");

    const contenedorError = campo.closest(".grupo-formulario")?.querySelector(".error-campo");
    if (contenedorError) {
        contenedorError.textContent = "";
    }
}

/* ==========================================================================
   CARRITO — se usa en pages/carrito/carrito.html
   (usa obtenerCarrito/guardarCarrito, definidas en productos.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("lista-carrito")) inicializarPaginaCarrito();
    if (document.getElementById("resumen-pago")) inicializarPaginaPago();
});

function inicializarPaginaCarrito() {
    renderizarCarrito();

    document.getElementById("lista-carrito").addEventListener("click", (evento) => {
        const boton = evento.target.closest("button");
        if (!boton) return;

        const fila = boton.closest("[data-id]");
        const id = Number(fila.dataset.id);

        if (boton.classList.contains("btn-sumar")) cambiarCantidad(id, 1);
        if (boton.classList.contains("btn-restar")) cambiarCantidad(id, -1);
        if (boton.classList.contains("btn-eliminar")) eliminarDelCarrito(id);
    });
}

function renderizarCarrito() {
    const contenedor = document.getElementById("lista-carrito");
    const vacioMsg = document.getElementById("carrito-vacio");
    const carrito = obtenerCarrito();

    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        if (vacioMsg) vacioMsg.style.display = "block";
        actualizarTotales(carrito);
        return;
    }
    if (vacioMsg) vacioMsg.style.display = "none";

    carrito.forEach((item) => {
        const fila = document.createElement("div");
        fila.className = "fila-carrito";
        fila.dataset.id = item.id;
        fila.innerHTML = `
            <img src="${item.imagen}" alt="${item.titulo}" class="fila-carrito__imagen">
            <div class="fila-carrito__info">
                <p class="fila-carrito__titulo">${item.titulo}</p>
                <p class="fila-carrito__precio-unit">$${item.precio} c/u</p>
            </div>
            <div class="fila-carrito__cantidad">
                <button type="button" class="btn-restar" aria-label="Restar una unidad">−</button>
                <span>${item.cantidad}</span>
                <button type="button" class="btn-sumar" aria-label="Sumar una unidad">+</button>
            </div>
            <p class="fila-carrito__subtotal">$${(item.precio * item.cantidad).toFixed(2)}</p>
            <button type="button" class="btn-eliminar" aria-label="Eliminar producto">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
        `;
        contenedor.appendChild(fila);
    });

    actualizarTotales(carrito);
}

function cambiarCantidad(id, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find((p) => p.id === id);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    guardarCarrito(carrito);
    document.dispatchEvent(new CustomEvent("carrito-actualizado"));
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter((p) => p.id !== id);
    guardarCarrito(carrito);
    document.dispatchEvent(new CustomEvent("carrito-actualizado"));
    renderizarCarrito();
}

function actualizarTotales(carrito) {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const totalPrecio = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

    const elCantidad = document.getElementById("carrito-cantidad-items");
    const elTotal = document.getElementById("carrito-total");
    const elBotonPagar = document.getElementById("btn-ir-a-pagar");

    if (elCantidad) elCantidad.textContent = totalItems;
    if (elTotal) elTotal.textContent = totalPrecio.toFixed(2);
    if (elBotonPagar) elBotonPagar.classList.toggle("deshabilitado", carrito.length === 0);
}

/* ==========================================================================
   PAGO — se usa en pages/pago/pago.html
   ========================================================================== */

function inicializarPaginaPago() {
    const carrito = obtenerCarrito();
    const resumen = document.getElementById("resumen-pago");
    const totalPrecio = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

    resumen.innerHTML = carrito.length === 0
        ? "<p>No tenés productos en el carrito.</p>"
        : carrito.map((item) => `
            <div class="resumen-pago__fila">
                <span>${item.titulo} × ${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
        `).join("");

    const elTotal = document.getElementById("pago-total");
    if (elTotal) elTotal.textContent = totalPrecio.toFixed(2);

    const formPago = document.getElementById("form-pago");
    if (!formPago) return;

    formPago.addEventListener("submit", (evento) => {
        evento.preventDefault();
        if (!validarFormulario(formPago)) return;
        if (carrito.length === 0) return;

        // Simulación de compra: vaciamos el carrito y mostramos confirmación.
        guardarCarrito([]);
        document.dispatchEvent(new CustomEvent("carrito-actualizado"));

        document.getElementById("pago-confirmacion").style.display = "block";
        formPago.style.display = "none";
        resumen.closest("section").style.display = "none";
    });
}
