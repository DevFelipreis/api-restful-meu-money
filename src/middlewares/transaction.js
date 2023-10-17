const { getTransaction } = require('../data/db.js');

module.exports = {
  async findTransactionByCategory(req, res, next) {
    const user_id = req.user.id;
    const filter = req.query.filtro;
    const transactions = await getTransaction(user_id);

    let arrayFilter = [];

    if (Array.isArray(filter)) {
      arrayFilter = filter.map((filter) => filter.toLowerCase());
    } else if (filter) {
      arrayFilter = [filter.toLowerCase()];
    }

    if (arrayFilter.length == 1) {
      const categoryName = [];
      transactions.forEach((element) => {
        if (element.categoria_nome.toLowerCase() == arrayFilter) {
          categoryName.push(element);
        }
      });

      if (categoryName.length == 0) {
        return res.status(200).json({ message: 'categoria não encontrada' });
      }
      return res.status(200).json(categoryName);
    }

    if (arrayFilter.length > 1) {
      const categoryName = [];
      transactions.forEach((element) => {
        if (arrayFilter.includes(element.categoria_nome.toLowerCase())) {
          categoryName.push(element);
        }
      });

      return res.status(200).json(categoryName);
    }

    if (arrayFilter.length == 0) {
      next();
    }
  },
};
