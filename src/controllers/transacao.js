const {
  getTransaction,
  idTransaction,
  createTransaction,
  existsCategoryId,
  deleteTransactionById,
  updateTransactionById,
} = require('../data/db.js');
module.exports = {
  async findTransactionById(req, res) {
    const { id } = req.params;

    const userId = req.user.id;

    const transaction = await idTransaction(id);
    const { rows } = transaction;

    if (transaction.rowCount == 0) {
      return res.status(404).json({
        mensagem: 'Transação não encontrada.',
      });
    }

    if (userId == rows[0].usuario_id) {
      return res.json(rows[0]);
    } else {
      return res.status(404).json({
        mensagem: 'Transação não encontrada.',
      });
    }
  },

  async findTransaction(req, res) {
    const userId = req.user.id;

    try {
      const transaction = await getTransaction(userId);

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500);
    }
  },

  async transactionCreate(req, res) {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const userId = req.user.id;
    const existsCategory = await existsCategoryId(categoria_id);

    if (
      !tipo ||
      !descricao ||
      valor === undefined ||
      categoria_id === undefined ||
      data === undefined
    ) {
      return res.status(400).json({
        mensage: 'Todos os campos obrigatórios devem ser informados.',
      });
    }
    if (!existsCategory) {
      return res.status(404).json({ mensage: 'Categoria Inválida' });
    }

    try {
      await createTransaction(
        descricao,
        valor,
        data,
        userId,
        categoria_id,
        tipo
      );
      const transaction = await getTransaction(userId);

      const lastTransaction = transaction[transaction.length - 1];
      return res.status(201).json(lastTransaction);
    } catch (error) {
      return res.status(404).json({ error: error.mensage });
    }
  },

  async deleteTransaction(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const transaction = await idTransaction(id);
      const { rows } = transaction;

      if (transaction.rowCount == 0) {
        return res.status(404).json({
          mensagem: 'Transação não encontrada.',
        });
      }

      if (userId != rows[0].usuario_id) {
        return res.status(404).json({
          mensagem: 'Transação não encontrada.',
        });
      }

      const deletedTransaction = await deleteTransactionById(id);

      if (deletedTransaction.length === 0) {
        return res.status(404).json({
          mensagem: 'Erro ao excluir a transação.',
        });
      }
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateTransaction(req, res) {
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    try {
      if (
        !tipo ||
        !descricao ||
        valor === undefined ||
        categoria_id === undefined ||
        data === undefined
      ) {
        return res.status(400).json({
          mensagem: 'Todos os campos obrigatórios devem ser informados.',
        });
      }

      const transaction = await idTransaction(id);
      const { rowCount } = transaction;

      if (rowCount === 0) {
        return res.status(404).json({
          mensagem: 'Transação não encontrada.',
        });
      }

      const updateTransactionResult = await updateTransactionById(
        id,
        tipo,
        descricao,
        valor,
        data,
        categoria_id
      );

      if (updateTransactionResult !== 1) {
        return res.status(500).json({
          mensagem: 'Erro ao atualizar a transação.',
        });
      }

      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
