const jwt = require('jsonwebtoken');
const env = require('../config/env.js');

module.exports = {
  async verifyToken(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ mensagem: 'Token não fornecido' });
    }
    const token = authorization.split(' ')[1];

    try {
      const tokenVerify = jwt.verify(token, env.jwt.pass);

      req.user = tokenVerify;

      next();
    } catch (error) {
      return res.status(403).json({
        mensagem:
          'Para acessar este recurso um token de autenticação válido deve ser enviado.',
      });
    }
  },
};
