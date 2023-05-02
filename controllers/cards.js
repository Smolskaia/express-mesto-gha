const Card = require('../models/card');

//   createCard создаёт карточку
//   deleteCard удаляет карточку по идентификатору
//   likeCard,
//   dislikeCard,

// getCards возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const createCard = (req, res) => {

};
/*В теле POST-запроса на создание карточки передайте
JSON-объект с двумя полями: name и link.*/
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

const deleteCard = (req, res) => {

};

const likeCard = (req, res) => {

};

const dislikeCard = (req, res) => {

};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
