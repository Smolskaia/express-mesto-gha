const userRouter = require('express').Router();

// подключаем контроллеры
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers); // возвращает всех пользователей
userRouter.get('/users/:userId', getUserById); // возвращает пользователя по _id
userRouter.post('/users', createUser); // создаёт пользователя
userRouter.patch('/users/me', updateProfile); // обновляет профиль
userRouter.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = userRouter;
