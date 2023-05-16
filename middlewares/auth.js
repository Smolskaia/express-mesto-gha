const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  // Для этого вызовем метод replace,
  // чтобы выкинуть из заголовка приставку 'Bearer '
  // Таким образом, в переменную token запишется только JWT
  const token = authorization.replace('Bearer ', '');
  // объявляем переменную payload до try,
  // т к если объявим ее внутри блока, она не будет видна снуружи
  let payload;

  try {
    /* После извлечения токена из запроса нужно убедиться,
    что пользователь прислал именно тот токен, который был выдан ему ранее
    метод verify модуля jsonwebtoken принимает на вход
   два параметра — токен и секретный ключ, которым этот токен
    был подписан.
    Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку.
     Если же с токеном что-то не так, вернётся ошибка.
     Чтобы её обработать, нужно обернуть метод jwt.verify в try...catch */
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
