const express = require('express');
const router = require('./routers.js');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`SERV RODANDO`);
});
