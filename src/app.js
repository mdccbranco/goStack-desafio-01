const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(newRepository);

  return response.status(200).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ err: "Error" });
  }

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400);
  }

  const updatedRepository = {
    title,
    url,
    techs,
  };

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    ...updatedRepository,
  };

  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ err: "Error" });
  }

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400);
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).json({ success: "true" });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ err: "Error" });
  }

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    likes: repositories[repoIndex].likes + 1,
  };

  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
