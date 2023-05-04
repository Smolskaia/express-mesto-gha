const userRouter = require('express').Router();

// подключаем контроллеры
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers); // возвращает всех пользователей
userRouter.get('/:userId', getUserById); // возвращает пользователя по _id
userRouter.post('/', createUser); // создаёт пользователя
userRouter.patch('/me', updateProfile); // обновляет профиль
userRouter.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = userRouter;
