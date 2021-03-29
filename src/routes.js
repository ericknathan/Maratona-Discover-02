//Biblioteca para criar e inicializar o servidor
const express = require('express');
//Sub-função do express para direcionar rotas
const routes = express.Router();

//Definindo diretório padrão para os arquivos à serem renderizados
const views = __dirname + "/views/"

const profile = {
    name: "Erick",
    avatar: "https://github.com/ericknathan.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4
}

//Renderizando as rotas
routes.get("/", (req, res) => res.render(views + 'index'));
routes.get("/job", (req, res) => res.render(views + 'job'));
routes.get("/job/edit", (req, res) => res.render(views + 'job-edit'));
routes.get("/profile", (req, res) => res.render(views + 'profile', { profile }));


module.exports = routes;