const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(r => r.id === id);

  if(repoIndex < 0)
    return response.status(400).json({ error: 'Repository ID does not exist.' })

  return next();
}

app.use('/repositories/:id', checkRepositoryExists);

app.get("/repositories", (request, response) => {
  /*
    GET / repositories: Rota que lista todos os repositórios; 
  */
 return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /*
    POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github
    desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato:
    { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 };
    Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
  */
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  /*
    PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;
  */
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex(r => r.id === id);

  const repository = { 
    ...repositories[repoIndex],
    title, 
    url, 
    techs
  }

  repositories[repoIndex] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  /*
    DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  */
  const { id } = request.params;
  const repoIndex = repositories.findIndex(r => r.id === id);
  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  /*
    POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do 
    id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
  */
  const { id } = request.params;
  const repoIndex = repositories.findIndex(r => r.id === id);
  const likes = repositories[repoIndex].likes + 1;
  const repository = {
    ...repositories[repoIndex],
    likes
  }

  repositories[repoIndex] = repository;

  response.json(repository);
});

module.exports = app;
