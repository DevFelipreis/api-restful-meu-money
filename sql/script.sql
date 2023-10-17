CREATE DATABASE dindin;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255)
);

CREATE TABLE transacoes (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255),
  valor INTEGER NOT NULL,
  data TIMESTAMP NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  tipo VARCHAR(255)
);

INSERT INTO categorias (descricao)
VALUES
  ('Alimentação'),
  ('Assinaturas e Serviços'),
  ('Casa'),
  ('Mercado'),
  ('Cuidados Pessoais'),
  ('Educação'),
  ('Família'),
  ('Lazer'),
  ('Pets'),
  ('Presentes'),
  ('Roupas'),
  ('Saúde'),
  ('Transporte'),
  ('Salário'),
  ('Vendas'),
  ('Outras receitas');

