const { Router } = require('express')
const { viewsRouter } = require('./views.route.js');
const { productsRouter, cartsRouter, sessionRouter, messagesRouter } = require('./apis');

const router = Router()

// definiendo vistas
router.use('/', viewsRouter);

// definiendo la API
router.use('/api/products/', productsRouter);
router.use('/api/carts/', cartsRouter);
router.use('/api/sessions/', sessionRouter);
router.delete('/api/messages', messagesRouter);

module.exports = router