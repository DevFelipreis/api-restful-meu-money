const routes = require('express').Router();
const {
  userDetail,
  userCreate,
  userLogin,
  userUpdate,
} = require('./controllers/user.js');
const { findCategory } = require('./controllers/category.js');
const {
  findTransactionById,
  findTransaction,
  transactionCreate,
  deleteTransaction,
  updateTransaction,
} = require('./controllers/transacao.js');

const { findTransactionByCategory } = require('./middlewares/transaction.js');

const { statement } = require('./controllers/statement.js');

const { verifyToken } = require('./middlewares/token.js');

routes.post('/login', userLogin);
routes.post('/usuario', userCreate);

routes.use(verifyToken);
routes.get('/usuario', userDetail);
routes.put('/usuario', userUpdate);
routes.get('/categoria', findCategory);
routes.get('/transacao/extrato', statement);
routes.get('/transacao', findTransactionByCategory, findTransaction);
routes.get('/transacao/:id', findTransactionById);
routes.post('/transacao', transactionCreate);
routes.delete('/transacao/:id', deleteTransaction);
routes.put('/transacao/:id', updateTransaction);

module.exports = routes;
