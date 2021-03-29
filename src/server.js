//Biblioteca para criar e inicializar o servidor
const express = require("express");
const server = express();
//Importanto as rotas definidas
const routes = require('./routes');

//Variáveis ded ambiente
const PORT = process.env.PORT || 3000;

//Selecionando a view-engine para fazer o processamento do html
server.set('view engine', 'ejs');

//Habilitar arquivos estáticos
server.use(express.static("public"));

//Routes
server.use(routes);

//Iniciando o servidor na porta definida
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
