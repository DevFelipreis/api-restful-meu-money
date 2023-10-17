const {
  getUser,
  createUser,
  existsEmail,
  getUserById,
  updateUser,
} = require('../data/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env.js');

module.exports = {
  async userDetail(req, res) {
    try {
      const user = await getUserById(req.user.id);

      if (!user.rows[0]) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const { senha: _, ...logedUser } = user.rows[0];
      return res.status(200).json(logedUser);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
  },

  async userCreate(req, res) {
    const { nome, email, senha } = req.body;

    const criptPass = await bcrypt.hash(senha, 10);

    try {
      if (!nome || !email || !senha) {
        return res
          .status(401)
          .json({ message: 'Nome, email ou senha são obrigatórios!' });
      }

      if (await existsEmail(email)) {
        return res.status(400).json({
          mensagem: 'Já existe usuário cadastrado com o e-mail informado.',
        });
      }

      const result = await createUser(nome, email, criptPass);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
  },

  async userUpdate(req, res) {
    const { nome, email, senha } = req.body;
    const userId = req.user.id;

    const user = await getUserById(userId);

    const emailExists = await existsEmail(email);

    if (emailExists && user.rows[0].email !== email) {
      return res.status(400).json({
        mensagem:
          'O e-mail informado já está sendo utilizado por outro usuário.',
      });
    }
    const criptPass = await bcrypt.hash(senha, 10);

    try {
      await updateUser(nome, email, criptPass, userId);

      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
  },

  async userLogin(req, res) {
    const { email, senha } = req.body;

    try {
      const emailExiste = await existsEmail(email);

      if (!emailExiste) {
        return res
          .status(404)
          .json({ message: 'Usuário e/ou senha inválido(s).' });
      }

      const user = await getUser(email);
      const { senha: _, ...logedUser } = user.rows[0];

      const userPassword = user.rows[0].senha;

      if (!userPassword) {
        return res
          .status(401)
          .json({ message: 'Usuário e/ou senha inválido(s).' });
      }

      const correctPassword = await bcrypt.compare(senha, userPassword);

      if (!correctPassword) {
        return res
          .status(401)
          .json({ message: 'Usuário e/ou senha inválido(s).' });
      }

      const token = jwt.sign(
        { id: user.rows[0].id },
        env.jwt.pass,
        env.jwt.options
      );

      return res.json({ usuario: logedUser, token });
    } catch (error) {
      return res.status(500).json({ error: 'error.message ' });
    }
  },
};
