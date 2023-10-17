const { Pool } = require('pg');

const { db } = require('../config/env.js');

const pool = new Pool(db);
module.exports = pool;

module.exports = {
  async getUser(email) {
    const sql = 'SELECT * from usuarios where email = $1 ';
    const value = [email];

    const user = await pool.query(sql, value);
    return user;
  },

  async getUserById(id) {
    const sql = 'SELECT * from usuarios where id = $1 ';
    const value = [id];

    const user = await pool.query(sql, value);
    return user;
  },

  async createUser(nome, email, senha) {
    const sql =
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';
    const values = [nome, email, senha];

    const result = await pool.query(sql, values);
    return result.rows[0];
  },

  async updateUser(nome, email, senha, id) {
    const sql =
      'UPDATE usuarios SET nome = $1,email= $2,senha = $3 where id = $4';
    const values = [nome, email, senha, id];

    await pool.query(sql, values);
  },
  async existsEmail(email) {
    const sql = 'SELECT COUNT(*) from usuarios where email = $1 ';
    const value = [email];

    const { rows } = await pool.query(sql, value);
    return rows[0].count > 0;
  },

  async getCategory() {
    const sql = 'SELECT * from categorias ';

    const category = await pool.query(sql);
    return category;
  },
  async existsCategoryId(id) {
    const sql = 'SELECT COUNT(*) from categorias where id = $1 ';
    const value = [id];

    const { rows } = await pool.query(sql, value);

    return rows[0].count > 0;
  },

  async createTransaction(
    descricao,
    valor,
    data,
    usuario_id,
    categoria_id,
    tipo
  ) {
    const sql =
      'INSERT INTO transacoes (descricao,valor, data, usuario_id,categoria_id,tipo) VALUES ($1,$2,$3,$4,$5,$6) returning *';

    const values = [descricao, valor, data, usuario_id, categoria_id, tipo];

    const transaction = await pool.query(sql, values);
    return transaction;
  },

  async getTransaction(usuario_id) {
    const sql = `SELECT t.*, c.descricao as "categoria_nome" from transacoes t
    INNER JOIN categorias c ON t.categoria_id = c.id
    where usuario_id = $1;`;
    const value = [usuario_id];

    const transaction = await pool.query(sql, value);
    return transaction.rows;
  },

  async idTransaction(id) {
    const sql = 'SELECT * from transacoes where id = $1 ';
    const value = [id];

    const rows = await pool.query(sql, value);
    return rows;
  },

  async deleteTransactionById(id) {
    const sql = 'DELETE FROM transacoes WHERE id = $1';
    const value = [id];

    const result = await pool.query(sql, value);
    return result.rowCount;
  },

  async updateTransactionById(id, tipo, descricao, valor, data, categoria_id) {
    const sql =
      'UPDATE transacoes SET tipo=$2, descricao=$3, valor=$4, data=$5, categoria_id=$6 WHERE id = $1';
    const values = [id, tipo, descricao, valor, data, categoria_id];

    const result = await pool.query(sql, values);
    return result.rowCount;
  },

  async getStatement(user_id) {
    const sqlEntrada = ` SELECT SUM(valor) from transacoes where tipo = 'entrada' AND usuario_id = $1 `;
    const sqlSaida = ` SELECT SUM(valor) from transacoes where tipo = 'saida' AND usuario_id = $1 `;

    const value = [user_id];

    let { rows: resultEntrada } = await pool.query(sqlEntrada, value);
    let { rows: resultSaida } = await pool.query(sqlSaida, value);

    return { resultEntrada, resultSaida };
  },
};
