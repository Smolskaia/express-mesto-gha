const mongoose = require('mongoose');
const validator = require('validator');

// Опишем схему:
const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле "avatar" должно быть заполнено'],
  },
}, { versionKey: false });

// создаём модель и экспортируем её
// передаем методу mongoose.model два аргумента:
// имя модели и схему, которая описывает будущие документы
module.exports = mongoose.model('user', userSchema);
