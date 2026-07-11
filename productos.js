/* ==========================================================================
   PRODUCTOS.JS
   Se encarga de:
   1. Traer productos desde una API REST con fetch (DummyJSON, categoría
      "womens-dresses" — ropa de mujer real y lista para usar).
   2. Dibujar las tarjetas de producto en el DOM.
   3. Agregar productos al carrito cuando se hace click en "Agregar".

   NOTA PARA SEGUIR EL PROYECTO: DummyJSON tiene más categorías de mujer
   que podés combinar (womens-shoes, womens-bags, womens-jewellery,
   womens-watches). Para ver todas: https://dummyjson.com/products/category-list
   Si más adelante armás tu propio catálogo, solo tenés que cambiar
   URL_API y ajustar los nombres de campo (title/price/thumbnail) en
   renderizarProductos().
   ========================================================================== */

const URL_API = "https://dummyjson.com/products/category/womens-dresses";


document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-productos");
    // Este script se reutiliza en más de una página (index, ofertas...).
    // Si la página actual no tiene el contenedor, no hacemos nada.
    if (!contenedor) return;

    obtenerProductos(contenedor);
});

/**
 * Pide los productos a la API con fetch y los muestra en pantalla.
 * Maneja el estado de carga y los posibles errores de red.
 */
async function obtenerProductos(contenedor) {
    const mensajeEstado = document.getElementById("mensaje-productos");

    try {
        const respuesta = await fetch(URL_API);

        if (!respuesta.ok) {
            throw new Error(`La API respondió con estado ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        // DummyJSON devuelve { products: [...], total, skip, limit }
        const productos = datos.products;

        if (mensajeEstado) mensajeEstado.textContent = "";
        renderizarProductos(productos, contenedor);

    } catch (error) {
        console.error("Error al traer los productos:", error);
        if (mensajeEstado) {
            mensajeEstado.textContent = "No se pudieron cargar los productos. Probá de nuevo más tarde.";
        }
    }
}

/**
 * Recibe un array de productos y arma una tarjeta por cada uno.
 */
function renderizarProductos(productos, contenedor) {
    contenedor.innerHTML = "";

    productos.forEach((producto) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-producto";

        tarjeta.innerHTML = `
            <div class="tarjeta-producto__imagen-wrap">
                <img src="${producto.thumbnail}" alt="${producto.title}" loading="lazy">
            </div>
            <div class="tarjeta-producto__cuerpo">
                <h3 class="tarjeta-producto__titulo">${producto.title}</h3>
                <span class="tarjeta-producto__precio">$${producto.price}</span>
                <button class="tarjeta-producto__boton" type="button">
                    <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
                    Agregar al carrito
                </button>
            </div>
        `;

        const boton = tarjeta.querySelector(".tarjeta-producto__boton");
        boton.addEventListener("click", () => {
            agregarAlCarrito({
                id: producto.id,
                titulo: producto.title,
                precio: producto.price,
                imagen: producto.thumbnail
            });
            confirmarAgregado(boton);
        });

        contenedor.appendChild(tarjeta);
    });
}

/**
 * Da feedback visual breve en el botón cuando se agrega un producto.
 */
function confirmarAgregado(boton) {
    const textoOriginal = boton.innerHTML;
    boton.classList.add("agregado");
    boton.innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i> Agregado`;

    setTimeout(() => {
        boton.classList.remove("agregado");
        boton.innerHTML = textoOriginal;
    }, 1200);
}

/**
 * Agrega un producto al carrito guardado en localStorage.
 * Si el producto ya estaba, le suma 1 a la cantidad en vez de duplicarlo.
 */
function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito(carrito);

    // Avisamos al resto de la página (por ejemplo, al contador del navbar)
    // que el carrito cambió, sin necesidad de recargar.
    document.dispatchEvent(new CustomEvent("carrito-actualizado"));
}

/* obtenerCarrito() y guardarCarrito() viven en main.js, que se carga */
/* antes que este archivo en todas las páginas del sitio.               */
