document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================
    // 1. Lógica para la Carga Dinámica de la API (OMDb API)
    // ==========================================================
    
    const API_CONTAINER = document.getElementById('peliculas-api-container');
    const API_LOADING = document.getElementById('api-loading');

    const OMDB_API_KEY = "aa148fdd"; 
    
    const movieTitles = [
        "Avatar: The Way of Water", 
        "Dune: Part Two", 
        "Oppenheimer", 
        "Barbie"
    ];

    function createMovieCard(movie) {
        const card = document.createElement('article');
        card.classList.add('api-card');
        
        const posterPath = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : 'imagenes/placeholder.jpg'; 
        const plot = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot.substring(0, 100) : 'Sin descripción disponible';
        const releaseDate = movie.Released && movie.Released !== 'N/A' ? movie.Released : 'Fecha Desconocida';
        
        card.innerHTML = `
            <h3>${movie.Title}</h3>
            <img src="${posterPath}" alt="Poster de ${movie.Title}">
            <p><strong>Fecha de Estreno:</strong> ${releaseDate}</p>
            <p>${plot}...</p>
        `;
        return card;
    }

    async function fetchMoviesFromAPI() {
        
        if (API_LOADING) {
            API_LOADING.style.display = 'block'; 
        }
        
        if (API_CONTAINER) {
            API_CONTAINER.innerHTML = ''; 
        }

        const fetchPromises = movieTitles.map(title => {
            const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&plot=short`;
            return fetch(url).then(response => response.json());
        });

        try {
            const results = await Promise.all(fetchPromises);
            
            results.forEach(data => {
                if (data.Response === "True") {
                    API_CONTAINER.appendChild(createMovieCard(data));
                }
            });

            if (API_CONTAINER.innerHTML === '') {
                 API_CONTAINER.innerHTML = '<p style="text-align: center;">No se pudieron cargar películas. Verifica que los títulos de búsqueda sean correctos.</p>';
            }

        } catch (error) {
            console.error("Fallo al obtener datos de la API de OMDb:", error);
            if (API_CONTAINER) {
                API_CONTAINER.innerHTML = `<p style="text-align: center; color: red;">Error al cargar películas: ${error.message}. Asegúrate de que tu API Key es correcta.</p>`;
            }
        } finally {
            if (API_LOADING) {
                API_LOADING.style.display = 'none'; 
            }
        }
    }

    fetchMoviesFromAPI();

    // ==========================================================
    // 2. Lógica de Validación Visual de Formularios
    // ==========================================================

    const isRequired = (value) => value.trim().length > 0;
    const minLength = (value, min) => value.trim().length >= min;
    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValidUrl = (value) => {
        try {
            new URL(value);
            return true;
        } catch (e) {
            return false;
        }
    };

    function validateField(inputElement, errorElement, validationFn, minLengthValue, errorMessage) {
        const value = inputElement.value;
        let isValid;

        if (validationFn === minLength) {
             isValid = validationFn(value, minLengthValue);
        } else {
             isValid = validationFn(value);
        }
        
        if (!isValid) {
            inputElement.classList.add('campo-error');
            errorElement.style.display = 'block';
            errorElement.textContent = errorMessage;
        } else {
            inputElement.classList.remove('campo-error');
            errorElement.style.display = 'none';
        }
        return isValid;
    }

    function setupFormValidation(formId, fields) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.setAttribute('novalidate', true);

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;

            fields.forEach(field => {
                const input = document.getElementById(field.id);
                const error = document.getElementById(`error-${field.id}`);
                
                if (input && error) {
                    const isValid = validateField(input, error, field.validation, field.minLength, field.message);
                    if (!isValid) {
                        isFormValid = false;
                    }
                }
            });

            if (isFormValid) {
                alert(`¡Formulario de ${formId.includes('contacto') ? 'Contacto' : 'Trabajo'} enviado con éxito! (Simulación)`);
                form.reset();
            } else {
                alert("Por favor, corrige los campos marcados antes de enviar.");
                const firstError = form.querySelector('.campo-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const error = document.getElementById(`error-${field.id}`);
            if (input && error) {
                input.addEventListener('blur', () => {
                    validateField(input, error, field.validation, field.minLength, field.message);
                });
            }
        });
    }

    const contactFields = [
        { id: 'nombre-contacto', validation: minLength, minLength: 3, message: 'El nombre es obligatorio y debe tener al menos 3 caracteres.' },
        { id: 'email-contacto', validation: isValidEmail, message: 'El email es obligatorio y debe tener un formato válido (ej: usuario@dominio.com).' },
        { id: 'mensaje-contacto', validation: minLength, minLength: 10, message: 'El mensaje es obligatorio y debe tener al menos 10 caracteres.' },
    ];

    const trabajoFields = [
        { id: 'nombre-trabajo', validation: isRequired, message: 'El nombre es obligatorio.', minLength: 1 },
        { id: 'email-trabajo', validation: isValidEmail, message: 'El email debe ser válido.' },
        { id: 'puesto-trabajo', validation: isRequired, message: 'Debe especificar un puesto.', minLength: 1 },
        { id: 'linkedin-trabajo', validation: isValidUrl, message: 'La URL de Linkedin es obligatoria y debe ser válida.' },
        { id: 'experiencia-trabajo', validation: minLength, minLength: 10, message: 'Por favor, detalle su experiencia (mínimo 10 caracteres).' },
    ];

    setupFormValidation('contacto-form', contactFields);
    setupFormValidation('trabajo-form', trabajoFields);

    // ==========================================================
    // 3. Lógica para botones de Compra/Carrito (Interactividad con Modal)
    // ==========================================================

    const botonesCompra = document.querySelectorAll('.boton-compra');
    const carritoContador = document.getElementById('carrito-contador'); 

    const modal = document.getElementById('modal-pelicula');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const modalImagen = document.getElementById('modal-imagen');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalGenero = document.getElementById('modal-genero');
    const modalHorarios = document.getElementById('modal-horarios');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalPrecio = document.getElementById('modal-precio');
    const modalAgregarCarritoBtn = document.getElementById('modal-agregar-carrito');

    let carrito = JSON.parse(localStorage.getItem('carritoCinepolis')) || [];

    function actualizarContadorCarrito() {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (carritoContador) {
            carritoContador.textContent = totalItems;
        } else {
            console.log(`Carrito actualizado. Total de ítems: ${totalItems}`);
        }
    }

    actualizarContadorCarrito();

    function agregarAlCarrito(producto) {
        const index = carrito.findIndex(item => item.id === producto.id);

        if (index > -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem('carritoCinepolis', JSON.stringify(carrito));
        
        actualizarContadorCarrito();
        alert(`"${producto.nombre}" agregado al carrito. ¡Gracias por tu compra!`);
        modal.style.display = 'none';
    }

    botonesCompra.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const card = this.closest('.pelicula-card');
            
            if (!card) return;

            const nombreProducto = card.querySelector('h3').textContent.trim();
            const imagenSrc = card.querySelector('img').src;
            const generoTexto = card.querySelector('p:nth-of-type(1)') ? card.querySelector('p:nth-of-type(1)').innerHTML.replace('<strong>Género: </strong>', '').replace('<br>', ' ').replace('<strong>Horarios:</strong>', '') : 'Género Desconocido';
            const descripcionTexto = card.querySelector('p:nth-of-type(2)') ? card.querySelector('p:nth-of-type(2)').textContent.trim() : 'Sin descripción.';
            
            const horariosMatch = card.querySelector('p:nth-of-type(1)').textContent.match(/Horarios:\s*(.*)/);
            const horariosTexto = horariosMatch ? horariosMatch[1].trim() : 'Horarios no disponibles';

            const esConfiteria = this.textContent.includes('Agregar al Carrito');

            modalImagen.src = imagenSrc;
            modalTitulo.textContent = nombreProducto;
            modalGenero.innerHTML = `<strong>Género:</strong> ${generoTexto.split('Horarios:')[0].trim()}`;
            modalHorarios.innerHTML = `<strong>Horarios:</strong> ${horariosTexto}`;
            modalDescripcion.textContent = descripcionTexto;
            
            let precio = 0;
            let productoId = nombreProducto.toLowerCase().replace(/\s/g, '-');

            if (esConfiteria) {
                if (nombreProducto.includes('Popcorn XL')) precio = 4500;
                else if (nombreProducto.includes('Nachos Supreme')) precio = 2800;
                else if (nombreProducto.includes('Coca-Cola')) precio = 1500;
                else precio = 2500;
                
                modalPrecio.innerHTML = `<strong>Precio:</strong> $${precio.toLocaleString('es-AR')} ARS`;
                modalAgregarCarritoBtn.textContent = "Agregar al Carrito";
                modalAgregarCarritoBtn.style.display = 'block';
                modalAgregarCarritoBtn.onclick = () => {
                    agregarAlCarrito({ nombre: nombreProducto, precio: precio, id: productoId });
                };
            } else {
                precio = 5000;
                modalPrecio.innerHTML = `<strong>Precio Entrada:</strong> $${precio.toLocaleString('es-AR')} ARS`;
                modalAgregarCarritoBtn.textContent = "Comprar Entrada";
                modalAgregarCarritoBtn.style.display = 'block';
                modalAgregarCarritoBtn.onclick = () => {
                    alert(`¡Entrada para "${nombreProducto}" comprada por $${precio.toLocaleString('es-AR')} ARS! (Simulación de compra de entrada)`);
                    modal.style.display = 'none';
                };
            }
            
            modal.style.display = 'block';
        });
    });

    cerrarModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

});