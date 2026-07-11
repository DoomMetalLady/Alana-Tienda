# Alana 👗

Proyecto de e-commerce (Talento Tech) de **ropa de mujer**. Sitio tipo marketplace, simple e intuitivo, hecho con HTML5, CSS3 y JavaScript puro (sin frameworks).

## ¿Qué hace?

- Muestra productos traídos en vivo desde una API REST real (`fetch` a DummyJSON, categoría `womens-dresses`), en tarjetas con imagen, título y precio.
- Permite agregar productos a un carrito de compras.
- El carrito persiste en `localStorage`: se puede editar la cantidad, eliminar productos y ver el total actualizado en tiempo real, incluso si se cierra o recarga la página.
- Formulario de contacto validado con JavaScript (campos requeridos + formato de email) que envía los datos con Formspree.
- Formularios de login y registro con la misma validación.
- Simulación de pago que vacía el carrito al confirmar la compra.
- Diseño responsivo (mobile, tablet y escritorio).
- Buenas prácticas de accesibilidad: `alt` en imágenes, navegación por teclado, foco visible, enlace de salto al contenido.
- SEO básico: metaetiquetas de descripción, keywords y `title` en cada página.

## Estructura de carpetas

```
alana/
├── assets/                  # recursos generales (a completar)
├── iconos/                  # íconos propios (a completar)
├── img/                     # imágenes propias del catálogo (a completar)
├── pages/
│   ├── carrito/carrito.html
│   ├── ofertas/ofertas.html
│   ├── pages_footer/contacto.html
│   ├── pages_footer/preguntas-frecuentes.html
│   ├── pago/pago.html
│   ├── perfil_de_usuario/perfil.html
│   ├── registro_&_login/login.html
│   ├── registro_&_login/registro.html
│   └── paginas-internas.css   # estilos compartidos por todas las páginas internas
├── estilos_index.css          # estilos de la home (hero, categorías, tarjetas de producto)
├── estilos_navbar_&_footer.css # tokens de diseño + header + footer (se usan en TODO el sitio)
├── index.html
├── main.js                    # utilidades del carrito, validación de formularios, pago
├── navbar.js                  # menú mobile + contador de carrito en el header
├── productos.js                # fetch a la API + render de tarjetas + agregar al carrito
└── footer.js                   # formulario de contacto (validación + Formspree)
```

## API usada

El catálogo se trae en vivo de **DummyJSON**: `https://dummyjson.com/products/category/womens-dresses`.
No hace falta clave ni backend propio, ya funciona tal cual. Otras categorías de mujer disponibles en la misma API, por si querés sumar más productos: `womens-shoes`, `womens-bags`, `womens-jewellery`, `womens-watches`. Podés ver el listado completo en `https://dummyjson.com/products/category-list`.

## Cómo seguir desde acá

1. Si querés combinar más categorías (por ejemplo vestidos + carteras), armá varios `fetch` y unificá los arrays antes de renderizar.
2. Poné tu endpoint real de Formspree en `footer.js` (línea `URL_FORMSPREE`).
3. Sumá tus propias imágenes en `/img` y `/iconos`.
4. Los colores y tipografías están centralizados como variables CSS en `estilos_navbar_&_footer.css` (`:root`), así que podés cambiar la paleta entera desde un solo lugar.
