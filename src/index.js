const express = require('express');
const router = require('./routers.js');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`SERV RODANDO NA PORTA ${PORT}`);
});
