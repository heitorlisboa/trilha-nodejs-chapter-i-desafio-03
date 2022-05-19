const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  request.repository = repository;

  return next();
}

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', checksExistsRepository, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  if (title) repository.title = title;
  if (url) repository.url = url;
  if (techs) repository.techs = techs;

  return response.status(200).json(repository);
});

app.delete('/repositories/:id', checksExistsRepository, (request, response) => {
  const { repository } = request;

  const repositoryIndex = repositories.findIndex((repo) => repo === repository);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post(
  '/repositories/:id/like',
  checksExistsRepository,
  (request, response) => {
    const { repository } = request;

    const likes = ++repository.likes;

    return response.status(200).json({ likes });
  }
);

module.exports = app;
