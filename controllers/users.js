const User = require('../models/user');
const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

const getUserById = (req, res) => {
  const { userId } = req.user._id;
  // Метод findById ищет запись по идентификатору, то есть свойству _id
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect request' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // метод модели create принимает
  // на вход объект с данными, которые нужно записать в базу
  User.create({ name, about, avatar })
  /* Метод create может быть промисом —
  ему можно добавить обработчики then и catch, чтобы
  вернуть клиенту данные или ошибку */

  // вернём записанные в базу данные
    .then((user) => res.send({ data: user }))
  // если данные не записались
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect user data' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect profile data' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.user._id;
  // третьим аргументом метод обновления документов принимает объект опций
  // new: true - передать обновлённый объект на вход обработчику then
  // runValidators: true - валидировать новые данные перед записью в базу
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect avatar data' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
