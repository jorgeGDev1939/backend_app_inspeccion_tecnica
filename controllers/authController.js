// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Token = require('../models/Token');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ msg: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Autenticación de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Olvido de contraseña
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Recuperar Contraseña',
      text: `Para recuperar tu contraseña, haz clic en este enlace: ${process.env.CLIENT_URL}/reset-password/${token}`,
    });

    res.json({ msg: 'Correo electrónico enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Restablecimiento de contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ msg: 'El token no es válido' });
    }

    await User.findByIdAndUpdate(decoded.id, { password });

    res.json({ msg: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};
