const { Router } = require('express');
const { MessageMongo } = require('../../daos/mongo/message.daomongo.js');

const router = Router();

const messages = new MessageMongo();

// DELETE http://localhost:PORT/api/messages
router.delete('/', async (req, res) => {
  await messages.clearMessages();
  res.status(200).json({
    status: 'ok',
  });
})

module.exports = router;