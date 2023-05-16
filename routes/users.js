const userRouter = require('express').Router();

// подключаем контроллеры
const {
  getUsers,
  getUserById,
  getUser,
  // createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers); // возвращает всех пользователей
userRouter.get('/:userId', getUserById); // возвращает пользователя по _id
userRouter.get('/me', getUser); // возвращает информацию о текущем пользователе
// userRouter.post('/', createUser); // создаёт пользователя
userRouter.patch('/me', updateProfile); // обновляет профиль
userRouter.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = userRouter;
