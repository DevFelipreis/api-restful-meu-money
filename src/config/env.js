module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'dindin',
  },
  jwt: {
    pass: 'senhajwt',
    options: {
      expiresIn: '24h',
    },
  },
};
