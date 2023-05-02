const router = require('express').Router();

// подключаем контроллеры
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUserById); // возвращает пользователя по _id
router.post('/users', createUser); // создаёт пользователя
router.patch('/users/me', updateProfile); // обновляет профиль
router.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
