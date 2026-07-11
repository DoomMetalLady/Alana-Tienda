

const URL_FORMSPREE = "https://formspree.io/f/xojrrjrz";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-contacto");
    if (!formulario) return;

    formulario.addEventListener("submit", manejarEnvioContacto);
});

async function manejarEnvioContacto(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const mensajeEstado = document.getElementById("mensaje-envio-contacto");

    if (!validarFormulario(formulario)) {
        if (mensajeEstado) {
            mensajeEstado.textContent = "Revisá los campos marcados en rojo.";
            mensajeEstado.className = "mensaje-formulario mensaje-formulario--error";
        }
        return;
    }

    const boton = formulario.querySelector("button[type='submit']");
    const textoOriginalBoton = boton.textContent;
    boton.disabled = true;
    boton.textContent = "Enviando...";

    try {
        const respuesta = await fetch(URL_FORMSPREE, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: new FormData(formulario)
        });

        if (!respuesta.ok) throw new Error("Formspree respondió con error");

        if (mensajeEstado) {
            mensajeEstado.textContent = "¡Gracias! Tu mensaje fue enviado.";
            mensajeEstado.className = "mensaje-formulario mensaje-formulario--exito";
        }
        formulario.reset();

    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        if (mensajeEstado) {
            mensajeEstado.textContent = "No se pudo enviar el mensaje. Probá de nuevo en un rato.";
            mensajeEstado.className = "mensaje-formulario mensaje-formulario--error";
        }
    } finally {
        boton.disabled = false;
        boton.textContent = textoOriginalBoton;
    }
}
