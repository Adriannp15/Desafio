const { Router } = require('express');
const { CartMongo } = require('../../daos/mongo/cart.daomongo');

const router = Router();
const carrito = new CartMongo

// GET http://localhost:PORT/api/carts/
router.get('/', async (req, res) => {
  let { populate } = req.query;
  populate = populate || true
  const resp = await carrito.getCarts(null, populate);

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// GET http://localhost:PORT/api/carts/:cid
router.get('/:cid', async (req, res) => {
  const id = req.params.cid;
  let { populate } = req.query;
  populate = populate || true
  const resp = await carrito.getCarts(id, populate);

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// POST http://localhost:PORT/api/carts/ (crea carrito)
router.post('/', async (req, res) => {
  const resp = await carrito.create();

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// PUT http://localhost:PORT/api/carts/:cid + body product
router.put('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const newProducts = req.body

  const resp = await carrito.updateCartProducts(cid, newProducts);

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// DEL http://localhost:PORT/api/carts/:cid + body product
router.delete('/:cid', async (req, res) => {
  const cid = req.params.cid;

  const resp = await carrito.removeCartProducts(cid);

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// POST http://localhost:PORT/api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const {cid, pid} = req.params;

  const resp = await carrito.addProduct(cid, pid);

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// PUT http://localhost:PORT/api/carts/:cid/product/:pid + body quantity
router.put('/:cid/product/:pid', async (req, res) => {
  const {cid, pid} = req.params;
  const {quantity} = req.body
  let resp

  if (isNaN(quantity) ) {
    resp = "Se ha introducido mal la cantidad"
  } else {
    resp = await carrito.updateCartQuantity(cid, pid, quantity);
  }

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

// DELETE http://localhost:PORT/api/carts/:cid/product/:pid
router.delete('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const resp = await carrito.removeProduct(cid, pid);

  if (typeof resp === 'string') {
    res.status(400).json({
      status: 'error',
      data: resp,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: resp,
    });
  }
});

module.exports = router;