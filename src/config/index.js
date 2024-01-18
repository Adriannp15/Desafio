require('dotenv').config();

//conexion Mongo Atlas a traves de mongoose
//-------------------------------------------------------------------
const mongoose = require('mongoose');

exports.connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@gustsirt.jaw8omb.mongodb.net/ecommerce?retryWrites=true&w=majority`,
  );
  console.log('Base de datos conectada');
};

//conexion Mongo Atlas session
//-------------------------------------------------------------------
const session = require('express-session');
const MongoStore = require('connect-mongo');

exports.sessionAtlas = (app) => {
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@gustsirt.jaw8omb.mongodb.net/ecommerce?retryWrites=true&w=majority`,
        mongoOptions: {
          //useNewUrlParser: true, // estas 2opciones luego ya son por defecto y no es necesario ponerlo
          //useUnifiedTopology: true,
        },
        ttl: 3600, // milisegundos --> hs
      }),
      secret: process.env.MONGO_SECRETCODE,
      //resave: true,
      saveUninitialized: true,
    })
  );
};
