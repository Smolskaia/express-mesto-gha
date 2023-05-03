const mongoose = require('mongoose');
// Опишем схему:
const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
}, { versionKey: false });

// создаём модель и экспортируем её
// передаем методу mongoose.model два аргумента:
// имя модели и схему, которая описывает будущие документы
module.exports = mongoose.model('user', userSchema);
