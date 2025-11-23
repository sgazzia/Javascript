let carrito = [];

const productosData = {
    'avatar': { id: 'avatar', nombre: 'Entrada: Avatar 3 (General)', precio: 5000, tipo: 'pelicula', imagen: 'imagenes/Peliculas/Avatar.jpg', horarios: '19:00, 22:30', descripcion: "Jake Sully, ahora Na'vi, debe proteger Pandora de la amenaza humana mientras explora nuevas culturas." },
    'conjuro': { id: 'conjuro', nombre: 'Entrada: El Conjuro 4 (General)', precio: 5000, tipo: 'pelicula', imagen: 'imagenes/Peliculas/Conjuro4.jpg', horarios: '17:00, 21:00', descripcion: "Ed y Lorraine Warren se enfrentan a un último caso escalofriante de posesión demoníaca para cerrar su legado." },
    'demon': { id: 'demon', nombre: 'Entrada: Demon Slayer (General)', precio: 5000, tipo: 'pelicula', imagen: 'imagenes/Peliculas/demon.jpg', horarios: '15:00, 18:00', descripcion: "Un joven cazador busca la cura para su hermana demonizada mientras lucha contra poderosos demonios ancestrales." },

    'popcorn-xl': { id: 'popcorn-xl', nombre: 'Combo Popcorn XL', precio: 4500, tipo: 'confiteria', imagen: 'imagenes/Comida/popcorn.jpg', descripcion: 'Popcorn extra grande y dos bebidas de 750ml.' },
    'nachos-supreme': { id: 'nachos-supreme', nombre: 'Nachos Supreme', precio: 2800, tipo: 'confiteria', imagen: 'imagenes/Comida/nachosqueso.jpg', descripcion: 'Porción grande de nachos, queso cheddar y jalapeños.' },
    'coca-cola': { id: 'coca-cola', nombre: 'Gaseosa Coca-Cola (750ml)', precio: 1500, tipo: 'confiteria', imagen: 'imagenes/Comida/Coca.jpg', descripcion: 'Una gaseosa para refrescar la salida para que sea inolvidable.' }
};

const botonMapeo = {
    'Avatar 3': 'avatar',
    'El Conjuro 4': 'conjuro',
    'Demon Slayer': 'demon',
    'Combo Popcorn XL': 'popcorn-xl',
    'Nachos Supreme': 'nachos-supreme',
    'Gaseosa Coca-Cola (750ml)': 'coca-cola'
};

const carritoContadorUI = document.getElementById('carrito-contador');
const modalCarrito = document.getElementById('modal-carrito');
const listaCarritoUI = document.getElementById('lista-carrito');
const totalCarritoUI = document.getElementById('total-carrito');
const botonVaciar = document.getElementById('vaciar-carrito');
const iconoCarrito = document.querySelector('.carrito-status');
const cerrarCarrito = document.querySelector('.cerrar-carrito');
const modalPelicula = document.getElementById('modal-pelicula');
const cerrarModalPelicula = document.querySelector('.cerrar-modal');
const btnAgregarModal = document.getElementById('modal-agregar-carrito');


function agregarAlCarrito(idProducto) {
    const producto = productosData[idProducto];
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: idProducto,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            tipo: producto.tipo
        });
    }
    
    actualizarCarritoUI();
}

window.eliminarDelCarrito = function(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarritoUI();
}

window.vaciarCarrito = function() {
    carrito = [];
    actualizarCarritoUI();
}

window.actualizarCantidad = function(idProducto, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    const item = carrito.find(item => item.id === idProducto);

    if (item) {
        if (isNaN(cantidad) || cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            item.cantidad = cantidad;
            actualizarCarritoUI();
        }
    }
}

function calcularTotal() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function actualizarCarritoUI() {
    listaCarritoUI.innerHTML = '';
    let total = calcularTotal();
    let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    carritoContadorUI.textContent = totalItems;

    if (carrito.length === 0) {
        listaCarritoUI.innerHTML = '<p class="carrito-vacio-mensaje">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('item-carrito');
            
            li.innerHTML = `
                <span class="item-nombre">${item.nombre}</span>
                <div class="item-controles"> 
                    <input 
                        type="number" 
                        min="1" 
                        value="${item.cantidad}" 
                        onchange="actualizarCantidad('${item.id}', this.value)"
                    >
                    <span class="item-precio">$${(item.precio * item.cantidad).toFixed(0)} ARS</span>
                    <button class="boton-eliminar-item" onclick="eliminarDelCarrito('${item.id}')">X</button>
                </div>
            `;
            listaCarritoUI.appendChild(li);
        });
    }
    
    totalCarritoUI.textContent = `Total: $${total.toFixed(0)} ARS`;
}

function llenarModalPelicula(idProducto) {
    const producto = productosData[idProducto];
    if (!producto || producto.tipo !== 'pelicula') return;

    document.getElementById('modal-titulo').textContent = producto.nombre.replace('Entrada: ', '').replace(' (General)', '');
    document.getElementById('modal-imagen').src = producto.imagen;
    document.getElementById('modal-genero').textContent = `Género: Ver detalles en la tarjeta.`;
    document.getElementById('modal-horarios').textContent = `Horarios: ${producto.horarios || 'N/A'}`;
    document.getElementById('modal-descripcion').textContent = producto.descripcion;
    document.getElementById('modal-precio').textContent = `Precio Entrada: $${producto.precio.toFixed(0)} ARS`;
    
    btnAgregarModal.dataset.productoId = idProducto;
    
    modalPelicula.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoUI();
    
    document.querySelectorAll('.boton-compra').forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.pelicula-card');
            if (!card) return;

            const titulo = card.querySelector('h3').textContent.trim();
            const idProducto = botonMapeo[titulo];

            if (e.target.textContent === 'Ver Detalles y Comprar') {
                llenarModalPelicula(idProducto);
            } else if (e.target.textContent === 'Agregar al Carrito') {
                agregarAlCarrito(idProducto);
            }
        });
    });

    iconoCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'block';
    });

    cerrarCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });
    
    cerrarModalPelicula.addEventListener('click', () => {
        modalPelicula.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalCarrito) {
            modalCarrito.style.display = 'none';
        }
        if (event.target === modalPelicula) {
            modalPelicula.style.display = 'none';
        }
    });
    
    btnAgregarModal.addEventListener('click', (e) => {
        const id = e.target.dataset.productoId;
        if (id) {
            agregarAlCarrito(id);
            modalPelicula.style.display = 'none'; 
        }
    });

    botonVaciar.addEventListener('click', vaciarCarrito);
    
    document.getElementById('finalizar-compra').addEventListener('click', () => {
        if (carrito.length > 0) {
            const total = calcularTotal().toFixed(0);
            alert(`¡Gracias por tu compra! El total a pagar es: $${total} ARS.`);
            vaciarCarrito();
            modalCarrito.style.display = 'none';
        } else {
             alert('El carrito está vacío. Agrega entradas o combos para finalizar la compra.');
        }
    });
});