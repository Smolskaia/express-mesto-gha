const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const { handleErrors } = require('./middlewares/handleErrors');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// создаем инстанс сервера
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser()); // подключаем парсер кук как мидлвэр
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// // добавляет в каждый запрос объект user
// app.use((req, res, next) => {
//   req.user = { _id: '6450012e96197202f568d6f1' };
//   next();
// });

app.use(handleErrors);
// подключаем маршруты
app.use('/', router);
// запускаем сервер на порте 300
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
