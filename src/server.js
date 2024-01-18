require('dotenv').config();

const express = require('express');
const { createServer } = require('node:http');
const serverIo = require('./middleware/serverIO.js');

const { connectDB, sessionAtlas } = require('./config/index.js');

const handlebars = require('express-handlebars');
const appRouter = require('./routes');

const port = process.env.PORT;
const app = express();
const server = createServer(app);

serverIo(server);
connectDB();
sessionAtlas(app);

// configuraciones de la App
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(appRouter);

// Confirmacion de inicio
server.listen(port, () => {
  console.log(`Server andando en port ${port}`);
});
