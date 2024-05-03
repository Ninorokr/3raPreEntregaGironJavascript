/* var catalogo = [{id: 1, nombre: "Manzanas", peso: 0.200, precio: 1.00, ruta: "../imagenes/manzana.jpg"}, 
{id: 2, nombre: "Naranjas", peso: 0.180, precio: 0.60}, 
{id: 3, nombre: "Papayas", peso: 2.000, precio: 2.00},
{id: 4, nombre: "Plátanos", peso: 0.150, precio: 0.50},
{id: 5, nombre: "Mangos", peso: 0.350, precio: 1.20},
{id: 6, nombre: "Duraznos", peso: 0.100, precio: 0.30},
{id: 7, nombre: "Fresas", peso: 0.005, precio: 0.05},
{id: 8, nombre: "Palta", peso: 0.450, precio: 1.80}] */

//TODO: AGREGAR PROPIEDAD STOCK
var catalogo = [
    {id: 1, nombre: "Manzana caña", categoria: "fruta", peso: 0.250, precio: 1.80, ruta: "imagenes/manzana.jpg"},
    {id: 2, nombre: "Cebolla roja", categoria: "verdura", peso: 0.200, precio: 0.30, ruta: "imagenes/cebolla.webp"},
    {id: 3, nombre: "Coliflor", categoria: "verdura", peso: 0.800, precio: 1.00, ruta: "imagenes/coliflor.webp"},
    {id: 4, nombre: "Lim\u006F\u0301n", categoria: "verdura", peso: 0.080, precio: 0.10, ruta: "imagenes/limón.webp"},
    {id: 5, nombre: "Palta Hass", categoria: "verdura", peso: 0.200, precio: 2.20, ruta: "imagenes/palta.jpg"},
    {id: 6, nombre: "Pera", categoria: "fruta", peso: 0.150, precio: 1.30, ruta: "imagenes/pera.jpg"},
    {id: 7, nombre: "Pitahaya", categoria: "fruta", peso: 0.200, precio: 2.00, ruta: "imagenes/pitahaya.webp"},
    {id: 8, nombre: "Poro", categoria: "verdura", peso: 0.150, precio: 0.50, ruta: "imagenes/poro.webp"}
]

const obtenerCarritoLS = () => JSON.parse(localStorage.getItem("carrito")) || []

principal(catalogo)

function principal(catalogo) {
    renderizarCarrito()
    renderizarProductos(catalogo)

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYRenderizar(catalogo))

    let inputBusqueda = document.getElementById("inputBusqueda")
    inputBusqueda.addEventListener("input", () => filtrarYRenderizar(catalogo))
}

function filtrarYRenderizar(catalogo) {
    renderizarProductos(filtrarCatalogo(catalogo))
}

function filtrarCatalogo(catalogo) {
    let inputBusqueda = document.getElementById("inputBusqueda")
    return catalogo.filter((producto) => {
        return producto.nombre.toLowerCase().includes(inputBusqueda.value) || producto.categoria.includes(inputBusqueda.value)
    })
}
        

function renderizarProductos(catalogo) {
    let productos = document.getElementById("contenedorProductos")
    productos.innerHTML = ""
    for (let i = 0; i < catalogo.length; i++) {
        let {id, nombre, peso, precio, ruta} = catalogo[i]
        productos.innerHTML += `
            <div class=tarjeta>
                <img src=${ruta}>
                <div class=propiedades>
                    <p>${nombre}</p>
                    <p>Peso: ${peso.toFixed(3)} Kgs.</p>
                    <p>Precio: S/. ${precio.toFixed(2)}</p>
                </div>
                <div class=contador>
                    <div class="boton menos" id=menos${id}>
                        -
                    </div>
                    <input value=0 size=1 id=cantidad${id}>
                    <div class="boton mas" id=mas${id}>
                        +
                    </div>
                </div>
            </div>
        `
    }
}

function agregarProductoAlCarrito(e, catalogo, cantidad) { //modificarCantidadCarrito (agregar o quitar)
    let carrito = obtenerCarritoLS()
    let idDelProducto = Number(e.target.id.replace(/^\D+/g, ''))

    let posProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto)
    let productoBuscado = catalogo.find(producto => producto.id === idDelProducto)

    if (posProductoEnCarrito == -1) {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            categoria: productoBuscado.categoria,
            peso: productoBuscado.peso,
            precio: productoBuscado.precio,
            cantidad: cantidad,
            pesoTotal: peso * cantidad,
            costoTotal: precio * cantidad
        })
    } else {
        carrito[posProductoEnCarrito].cantidad = cantidad
        carrito[posProductoEnCarrito].pesoTotal = Math.round(carrito[posProductoEnCarrito].peso * cantidad * 100) / 100
        carrito[posProductoEnCarrito].costoTotal = Math.round(carrito[posProductoEnCarrito].precio * cantidad * 100) / 100
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function renderizarCarrito() {
    let carrito = obtenerCarritoLS()
    let divCarrito = document.getElementById("divCarrito")
    divCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let {nombre, cantidad, pesoTotal, costoTotal, ruta} = producto
        let tarjetaProdCarrito = document.createElement("div")
        tarjetaProdCarrito.className = "tarjetaProdCarrito"

        tarjetaProdCarrito.innerHTML = `
            <img src=${ruta}>
            <p>${nombre}</p>
            <div class=contador>
                    <div class="boton menos">
                        -
                    </div>
                    <input value=${cantidad} size=1>
                    <div class="boton mas">
                        +
                    </div>
                </div>
            <p>${pesoTotal}</p>
            <p>${costoTotal}</p>
        `

        divCarrito.appendChild(tarjetaProdCarrito)
    })
}

function finalizarCompra() {
    localStorage.removeItem("carrito")
    renderizarCarrito([])
}