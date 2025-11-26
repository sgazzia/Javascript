document.addEventListener("DOMContentLoaded", () => {

    /* FORMULARIO CONTACTO= */
    const formContacto = document.getElementById("contacto-form");
    if (formContacto) {

        const nombreC = document.getElementById("nombre-contacto");
        const emailC = document.getElementById("email-contacto");
        const mensajeC = document.getElementById("mensaje-contacto");

        formContacto.addEventListener("submit", function(event) {
            let valido = true;
            // NOMBRE
            if (nombreC.value.trim().length < 3) {
                document.getElementById("error-nombre-contacto").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-nombre-contacto").style.display = "none";
            }
            //  EMAIL
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailC.value.trim())) {
                document.getElementById("error-email-contacto").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-email-contacto").style.display = "none";
            }
            // MENSAJE
            if (mensajeC.value.trim().length < 10) {
                document.getElementById("error-mensaje-contacto").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-mensaje-contacto").style.display = "none";
            }
            // STOP envío si hay errores
            if (!valido) {
                event.preventDefault();
            }
        });
    }

    /* FORMULARIO TRABAJA CON NOSOTROS */
    const formTrabajo = document.getElementById("trabajo-form");
    if (formTrabajo) {
        const nombre = document.getElementById("nombre-trabajo");
        const email = document.getElementById("email-trabajo");
        const puesto = document.getElementById("puesto-trabajo");
        const linkedin = document.getElementById("linkedin-trabajo");
        const experiencia = document.getElementById("experiencia-trabajo");

        formTrabajo.addEventListener("submit", function(event) {
            let valido = true;
            // NOMBRE
            if (nombre.value.trim().length < 3) {
                document.getElementById("error-nombre-trabajo").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-nombre-trabajo").style.display = "none";
            }
            //  EMAIL
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                document.getElementById("error-email-trabajo").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-email-trabajo").style.display = "none";
            }
            // PUESTO
            if (puesto.value.trim().length < 3) {
                document.getElementById("error-puesto-trabajo").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-puesto-trabajo").style.display = "none";
            }
            // LINKEDIN
            try {
                new URL(linkedin.value.trim());
                document.getElementById("error-linkedin-trabajo").style.display = "none";
            } catch {
                document.getElementById("error-linkedin-trabajo").style.display = "block";
                valido = false;
            }
            // EXPERIENCIA
            if (experiencia.value.trim().length < 10) {
                document.getElementById("error-experiencia-trabajo").style.display = "block";
                valido = false;
            } else {
                document.getElementById("error-experiencia-trabajo").style.display = "none";
            }

            if (!valido) {
                event.preventDefault();
            }
        });
    }
});