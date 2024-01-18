require('dotenv').config();
const { Router } = require('express');
const { validateFields, CustomError } = require('../../helpers');
const { UserMongo } = require('../../daos/mongo/user.daomongo');

const router = Router();

const users = new UserMongo();

// POST http://localhost:PORT/api/sessions/register
router.post('/register', async (req, res) => {
  try {
    const requieredfield = ['first_name', 'last_name', 'email', 'password'];
    const userData = validateFields(req.body, requieredfield);

    const userFound = await users.getUserByMail(userData.email);

    if (userFound) throw new CustomError(`Ya existe un usuario con ese email. pruebe con otro`,400,'POST http://localhost:PORT/api/sessions/sigin')

    if (req.body.uadmin) userData.admin = true;

    await users.createUser(userData)

    res.render('login', {
      title: 'Login',
      answer: 'Se ha registrado satisfactoriamente',
    });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      res.render('register', { title: 'Registrase', answer: error.message });
    } else {
      res.render('register', {
        title: 'Ocurrio un error, vuelva a intentarlo',
        answer: error.message,
      });
    }
  }
});

// POST http://localhost:PORT/api/sessions/login
router.post('/login', async (req, res) => {
  const requieredfield = ['email', 'password'];
  const userData = validateFields(req.body, requieredfield);
  try {
    if (userData.email == process.env.USER_ADMIN && userData.password == process.env.USER_ADMIN_PASS) {
      req.session.user = {
        first_name: "Admin",
        email: userData.email,
        role: "Admin"
      };
      return res.redirect('/products');
    }

    const userFound = await users.getUserByMail(userData.email);

    if (!userFound || userData.password !== userFound.password) {
      throw new CustomError(
        `Email o contraseña equivocado`,
        400,
        'POST http://localhost:PORT/api/sessions/login',
      );
    }

    req.session.user = {
      user: userFound._id,
      first_name: userFound.first_name,
      last_name: userFound.last_name,
      email: userFound.email,
      role: userFound.role,
    };
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      res.render('login', {
        title: 'Login',
        answer: error.message
      });
    } else {
      res.render('login', {
        title: 'Login',
        answer: 'Ocurrio un error, vuelva a intentarlo',
        code: error.statusCode || 500,
      });
    }
  }
});

// GET http://localhost:PORT/api/sessions/logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: 'error', error: err });
  });
  res.redirect('/');
});

module.exports = router;
