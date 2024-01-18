const { Router } = require('express');
const { ProductMongo } = require('../daos/mongo/products.daomongo.js');
const { CustomError } = require('../helpers/index.js');
const { authentication } = require('../middleware/auth.middleware.js');
const router = Router();

const productsMongo = new ProductMongo();

router.get('/', async (req, res) => {
  //res.redirect('/products');
  try {
    res.render('login', {
      title: 'Login',
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      title: 'Error',
      message: 'Ocurrio un error, vuelva a intentarlo',
      code: error.statusCode || 500,
    });
  }
});

router.get('/register', async (req, res) => {
  try {
    res.render('register', {
      title: 'Registrase',
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      title: 'Error',
      message: 'Ocurrio un error, vuelva a intentarlo',
      code: error.statusCode || 500,
    });
  }
});

router.get('/products', async (req, res) => {
  try {
    // handle url API products
    const { page = 1, sort, category, availability } = req.query;
    const apiUrl = new URL('http://localhost:8080/api/products');
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('limit', '5');
    if (sort) apiUrl.searchParams.set('sort', sort);
    if (category) apiUrl.searchParams.set('category', category);
    if (availability) apiUrl.searchParams.set('availability', availability);

    let resp = await fetch(apiUrl);
    data = await resp.json();

    if (data.error || page > data.totalPages || page < 0) {
      return res.render('products', {
        title: 'Productos',
        pageError: true,
        productError: data.error,
      });
    }

    // update product
    const product = data.data.docs.map((prd) => ({
      ...prd,
      price: prd.price.toLocaleString('es-ES', { style: 'decimal' }),
      unavailability: prd.stock === 0,
      link: `/products/${prd._id}`,
    }));

    const arrayString = req.url.split('?')[1]?.split('&') || [];

    function filterUrl(filter) {
      return `/products?${
        arrayString
          .filter((elm) => ![filter, 'page'].includes(elm.split('=')[0]))
          .join('&') || ''
      }`;
    }

    res.render('products', {
      title: 'Inicio',
      userName: req.session?.user?.first_name,
      userRole: req.session?.user?.role,
      productError: false,
      product,
      page: data.page,
      totalPages: data.totalPages,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: `${filterUrl('x')}${data.prevLink}`,
      nextLink: `${filterUrl('x')}${data.nextLink}`,
      category: await productsMongo.getCategorys(),
      ascend: `${filterUrl('sort')}sort=asc`,
      descend: `${filterUrl('sort')}sort=desc`,
      disorderly: `${filterUrl('sort')}sort=disorderly`,
      availability: `${filterUrl('availability')}availability=false`,
      unavailability: `${filterUrl('availability')}availability=true`,
      url: filterUrl('category'),
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      title: 'Error',
      message: 'Ocurrio un error, vuelva a intentarlo',
      code: error.statusCode || 500,
    });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const apiUrl = `http://localhost:8080/api/products/${pid}`;

    const resp = await fetch(apiUrl);
    const { error, data } = await resp.json();

    const objectRender = {
      title: 'Producto',
      userName: req.session?.user?.first_name,
      userRole: req.session?.user?.role,
      productError: error,
      product: data,
      cart: '6591b1a1419b33fbcb57e2b1',
    };
    res.render('product', objectRender);
  } catch (error) {
    console.error(error);
    res.render('error', {
      title: 'Error',
      message: 'Ocurrió un error, vuelve a intentarlo',
      code: error.statusCode || 500,
    });
  }
});

// falta optimizar
router.get('/cart', async (req, res) => {
  const objectRender = {
    title: 'Carrito',
    userName: req.session?.user?.first_name,
    userRole: req.session?.user?.role,
  };
  let resp = await await fetch(
    `http://localhost:8080/api/carts/6591b1a1419b33fbcb57e2b1`,
  );
  resp = await resp.json();
  const cart = resp.data;
  const products = cart.products;
  products.forEach((prd) => {
    prd['total'] = prd.product.price * prd.quantity;
  });

  if (resp.status == 'ok') {
    objectRender['cartError'] = false;
    objectRender['cartId'] = cart._id;

    if (products.length != 0) {
      objectRender['cartNoEmpty'] = true;
      objectRender['products'] = products;
    }
  } else {
    objectRender['cartError'] = true;
  }

  res.render('cart', objectRender);
});

router.get('/realTimeProducts', async (req, res) => {
  try {
    const apiUrl = 'http://localhost:8080/api/products?limit=100';
    const resp = await fetch(apiUrl);
    const data = await resp.json();

    const product = data.data.docs.map((prd) => ({
      ...prd,
      price: prd.price.toLocaleString('es-ES', { style: 'decimal' }),
    }));

    res.render('realTimeProducts', {
      title: 'Productos en tiempo Real',
      product,
      cssPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`,
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      title: 'Error',
      userName: req.session?.user?.first_name,
      userRole: req.session?.user?.role,
      message: 'Ocurrió un error, vuelve a intentarlo',
      code: error.statusCode || 500,
    });
  }
});

router.get('/chat', async (req, res) => {
  res.render('chat', {
    title: 'Chat',
    userName: req.session?.user?.first_name,
    userRole: req.session?.user?.role
  });
});

router.get('/user', async (req, res) => {
  try {
    res.render('user', {
      title: 'Usuario',
      userName: req.session?.user?.first_name,
      first_name: req.session?.user?.first_name,
      last_name: req.session?.user?.last_name,
      email: req.session?.user?.email,
      userRole: req.session?.user?.role
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      title: 'Error',
      userName: req.session?.user?.first_name,
      message: 'Ocurrió un error, vuelve a intentarlo',
      code: error.statusCode || 500,
    });
  }
});

exports.viewsRouter = router;
