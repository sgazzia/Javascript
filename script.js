document.addEventListener('DOMContentLoaded', () => {
    
    
    const OMDB_API_KEY = "aa148fdd"; 
    const TASTEDIVE_API_KEY = "1062321-StudentH-107BA24D"; 

    const API_CONTAINER = document.getElementById('peliculas-api-container');
    const API_LOADING = document.getElementById('api-loading');

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
            const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&plot=short`;
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
    
    async function fetchTasteDive(query) {
        const url = `https://tastedive.com/api/similar?q=${encodeURIComponent(query)}&k=${TASTEDIVE_API_KEY}&info=1`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Recomendaciones de TasteDive:", data);
        } catch (error) {
            console.error("Fallo al obtener recomendaciones de TasteDive:", error);
        }
    }

    fetchMoviesFromAPI();

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

    const botonesCompra = document.querySelectorAll('.boton-compra');
    const carritoIcono = document.querySelector('.carrito-status');
    const carritoContador = document.getElementById('carrito-contador'); 

    const modalPelicula = document.getElementById('modal-pelicula');
    const cerrarModalPelicula = document.querySelector('.cerrar-modal');
    const modalImagen = document.getElementById('modal-imagen');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalGenero = document.getElementById('modal-genero');
    const modalHorarios = document.getElementById('modal-horarios');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalPrecio = document.getElementById('modal-precio');
    const modalAgregarCarritoBtn = document.getElementById('modal-agregar-carrito');

    const modalCarrito = document.getElementById('modal-carrito');
    const cerrarModalCarrito = document.querySelector('.cerrar-carrito');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarritoDisplay = document.getElementById('total-carrito');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');

    let carrito = JSON.parse(localStorage.getItem('carritoCinepolis')) || [];

    function actualizarContadorCarrito() {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (carritoContador) {
            carritoContador.textContent = totalItems;
        }
    }

    function renderizarCarrito() {
        listaCarrito.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p class="carrito-vacio-mensaje">Tu carrito está vacío.</p>';
            totalCarritoDisplay.textContent = 'Total: $0 ARS';
            return;
        }

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-carrito');
            itemDiv.innerHTML = `
                <span class="item-nombre">${item.nombre}</span>
                <span class="item-cantidad">x${item.cantidad}</span>
                <span class="item-precio">$${subtotal.toLocaleString('es-AR')}</span>
            `;
            listaCarrito.appendChild(itemDiv);
        });

        totalCarritoDisplay.textContent = `Total: $${total.toLocaleString('es-AR')} ARS`;
    }

    function agregarAlCarrito(producto) {
        const index = carrito.findIndex(item => item.id === producto.id);

        if (index > -1) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem('carritoCinepolis', JSON.stringify(carrito));
        
        actualizarContadorCarrito();
        modalPelicula.style.display = 'none';
        
        alert(`"${producto.nombre}" agregado al carrito. ¡Total de ítems: ${carritoContador.textContent}!`);
    }

    actualizarContadorCarrito();

    botonesCompra.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const card = this.closest('.pelicula-card');
            if (!card) return;

            const nombreProducto = card.querySelector('h3').textContent.trim();
            const imagenSrc = card.querySelector('img').getAttribute('src'); 
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
                modalAgregarCarritoBtn.onclick = () => {
                    agregarAlCarrito({ nombre: nombreProducto, precio: precio, id: productoId, tipo: 'confiteria' });
                };
            } else {
                precio = 5000;
                productoId = 'entrada-' + productoId;
                modalPrecio.innerHTML = `<strong>Precio Entrada:</strong> $${precio.toLocaleString('es-AR')} ARS`;
                modalAgregarCarritoBtn.textContent = "Comprar Entrada";
                modalAgregarCarritoBtn.onclick = () => {
                    agregarAlCarrito({ nombre: `Entrada: ${nombreProducto}`, precio: precio, id: productoId, tipo: 'entrada' });
                };
            }
            
            modalAgregarCarritoBtn.style.display = 'block';
            modalPelicula.style.display = 'block';
        });
    });

    carritoIcono.addEventListener('click', () => {
        renderizarCarrito();
        modalCarrito.style.display = 'block';
    });

    cerrarModalPelicula.addEventListener('click', () => {
        modalPelicula.style.display = 'none';
    });

    cerrarModalCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target == modalPelicula) {
            modalPelicula.style.display = 'none';
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target == modalCarrito) {
            modalCarrito.style.display = 'none';
        }
    });

    vaciarCarritoBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            carrito = [];
            localStorage.removeItem('carritoCinepolis');
            actualizarContadorCarrito();
            renderizarCarrito();
        }
    });

    finalizarCompraBtn.addEventListener('click', () => {
        if (carrito.length > 0) {
            alert(`¡Compra finalizada! Total a pagar: ${totalCarritoDisplay.textContent}. En breve recibirá sus entradas.`);
            carrito = [];
            localStorage.removeItem('carritoCinepolis');
            actualizarContadorCarrito();
            renderizarCarrito();
            modalCarrito.style.display = 'none';
        } else {
            alert('El carrito está vacío. Agrega productos para finalizar la compra.');
        }
    });

});