const Card = require('../models/card');
// const {
//   ERROR_CODE_INCORRECT_DATA,
//   ERROR_CODE_NOT_FOUND,
//   ERROR_CODE_DEFAULT,
//   defaultErrorMessage,
// } = require('../utils/utils');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
  // Чтобы получить всю информацию об авторе карточки,
  // нужно вызвать метод populate, передав ему имя поля 'owner'
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    // .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
        // return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
        return next(new BadRequestError('Incorrect card data'));
      }
      // return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
      return next(err);
    });
};

// module.exports.deleteCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .orFail()
//     .then((card) => {
//       res.send({ data: card });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
//       }
//       if (err.name === 'DocumentNotFoundError') {
//         return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
//       }
//       return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
//     });
// };

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card with such id is not found'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('You can not delete card wich was added by other user'));
      }
      return Card.findByIdAndDelete(req.params.cardId).then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Incorrect card data'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
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
        // res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
        // return;
        return next(new NotFoundError('Card id not found'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
        // return;
        return next(new BadRequestError('Incorrect card data'));
      }
      // res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
        return next(new NotFoundError('Card id not found'));
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        // res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
        // return;
        return next(new BadRequestError('Incorrect card data'));
      }
      // res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
      return next(err);
    });
};
