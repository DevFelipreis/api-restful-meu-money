const { getStatement } = require('../data/db.js');

module.exports = {
  async statement(req, res) {
    const userId = req.user.id;

    try {
      const result = await getStatement(userId);
      let entrada = result.resultEntrada[0].sum;
      let saida = result.resultSaida[0].sum;

      if (entrada === null) {
        entrada = 0;
      }
      if (saida === null) {
        saida = 0;
      }

      return res.status(200).json({ entrada, saida });
    } catch (error) {}
  },
};
