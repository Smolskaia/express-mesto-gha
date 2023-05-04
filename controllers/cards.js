const Card = require('../models/card');
const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
  // Чтобы получить всю информацию об авторе карточки,
  // нужно вызвать метод populate, передав ему имя поля 'owner'
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

module.exports.createCard = (req, res) => {
  // в модели карточки есть поле owner, в котором
  // должен быть идентификатор карточки пользователя - ownerId
  // Теперь этот идентификатор нужно записывать в поле owner
  // при создании новой карточки
  const { name, link } = req.body;
  // const owner = req.user._id;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // чтобы в массиве лайков содержались уникальные значения
    // добавляем пользователя в массив, только если его там ещё нет
    // используя оператор $addToSet. оператор $pull используем чтобы убрать лайк
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};
