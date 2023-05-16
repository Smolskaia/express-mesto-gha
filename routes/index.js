const router = require('express').Router();
// const {
//   ERROR_CODE_NOT_FOUND,
// } = require('../utils/utils');
const { createUser, login } = require('../controllers/users');
const { validationSignin, validationSignup } = require('../utils/validation');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

const userRouter = require('./users');
const cardRouter = require('./cards');

// сначала вызовется auth, а затем,
// если авторизация успешна, createCard или userRouter
// т е роуты защищены авторизацией
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.post('/signin', validationSignin, login);
router.post('/signup', validationSignup, createUser);

router.use('/*', (req, res, next) => {
  // res.status(ERROR_CODE_NOT_FOUND)
  //   .send({ message: '404: Not Found' });
  next(new NotFoundError('404: Not Found'));
});

module.exports = router;
