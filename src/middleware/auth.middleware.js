require('dotenv').config();
const { usersModel } = require('../daos/mongo/models/user.model');
const { CustomError } = require('../helpers');

exports.authentication = async (req, res, next) => {
  try {
    if (req.session?.user?.email == process.env.USER_ADMIN) {
      next();
    } else {
      const userFound = await usersModel.findOne({
        email: req.session?.user?.email,
      });

      if (!userFound) {
        throw new CustomError(`Error de autenticación`, 400, 'authentication');
      }
      next();
    }
  } catch (error) {
    if (error instanceof CustomError) {
      res.render('error', {
        title: 'Error',
        message: error.message,
        code: error.statusCode || 400,
      });
    } else {
      res.render('error', {
        title: 'Error',
        message: 'Ocurrio un error, vuelva a intentarlo',
        code: error.statusCode || 500,
      });
    }
  }
};
