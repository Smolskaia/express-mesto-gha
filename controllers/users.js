const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  // User.find({ _id: id })
  User.findById(id)
    .then((user) => {
      // const user = users.find((item) => item._id === id);
      if (!user) {
        return res.status(404).send({ message: 'User is not found' });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const createUser = (req, res) => {
  // console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
