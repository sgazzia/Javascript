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
    // 3. Lógica para botones de Compra/Carrito (Interactividad con localStorage)
    // ==========================================================

    const botonesCompra = document.querySelectorAll('.boton-compra');
    const carritoContador = document.getElementById('carrito-contador'); 

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
        const index = carrito.findIndex(item => item.nombre === producto.nombre);

        if (index > -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem('carritoCinepolis', JSON.stringify(carrito));
        
        actualizarContadorCarrito();
        alert(`"${producto.nombre}" agregado al carrito. Total: ${carrito.length} artículos únicos.`);
    }

    botonesCompra.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const card = this.closest('.pelicula-card') || this.closest('.producto-card');
            
            if (!card) return;

            const nombreProducto = card.querySelector('h3').textContent.trim() || 'Producto Desconocido';
            const producto = {
                nombre: nombreProducto,
                precio: 500, 
                id: nombreProducto.toLowerCase().replace(/\s/g, '-') 
            };
            
            if (this.textContent.includes('Agregar al Carrito')) {
                agregarAlCarrito(producto);
            } else {
                 alert(`¡Acción Simulada!\n"${nombreProducto}" fue seleccionado para Ver Detalles y Comprar.\n(La lógica de checkout no está implementada.)`);
            }
        });
    });
});