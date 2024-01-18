d = document;
//Front Real Time Product
const socket = io();

const divSwiper = d.querySelector('#swiper');
const formRTP = d.querySelector('#formRTP');
const errorAlerts = d.querySelector('#errorAlerts');

var swiper = new Swiper('.swiper-container', {
  slidesPerView: 5,
  pagination: {
    el: ".swiper-pagination",
  },
});
formRTP.addEventListener('submit', (event) => {
  event.preventDefault();

  // Producto armado
  const prd = {
    title: d.querySelector('#frtitle').value,
    description: '...',
    code: d.querySelector('#frcode').value,
    price: d.querySelector('#frprice').value,
    stock: d.querySelector('#frstock').value,
    status: true,
    category: d.querySelector('#frcat').value,
    thumbnail: d.querySelector('#frimage').value,
  };

  // envia WebSocket (el prod armado)
  socket.emit('nuevoProducto', prd);

  // escucha WebSocket
  escuchar();
});

function deletePrd(code) {
  socket.emit('eliminarProducto', code);
  escuchar();
}

function escuchar() {
  socket.on('productos', (listProduct) => {
    let armandoHtml = '';
    listProduct.forEach((prd) => {
      armandoHtml += `<div class="swiper-slide">
        <img src=${prd.thumbnail}>
        <p class="sw-title">${prd.title}</p>
        <p class="sw-price">Precio: $ ${prd.price}</p>
        <p class="sw-code">Código: ${prd.code}</p>
        <button onclick="deletePrd('${prd.code}')">Eliminar</button>
      </div>`;
    });
    divSwiper.innerHTML = armandoHtml;

    // regenera carrusel
    swiper = new Swiper('.swiper-container', {
      slidesPerView: 5,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  });

  socket.on('error', (message) => {
    errorAlerts.innerHTML = message;
    setTimeout(() => {
      errorAlerts.innerHTML = '';
    },5000)
  })
}
