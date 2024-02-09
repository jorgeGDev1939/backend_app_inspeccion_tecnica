// controllers/usersController.js
const User = require('../models/User');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};
