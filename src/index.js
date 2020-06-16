const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

app.get("/projects", (request, response) => {
  const { title } = request.query;

  // only executes if there's a title
  // in this case, filter the projects by the queried title;
  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;
  // console.log(title);
  // console.log(owner);
  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };
  projects.push(project);

  console.log(title);
  console.log(owner);
  return response.json(project);
});

app.put("/projects/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const { title, owner } = request.body;

  console.log(id);

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(projects[projectIndex]);
});

app.delete("/projects/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  console.log(id);

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).json();
});

// second function is automatically executed when the server is started
app.listen(3333, () => {
  console.log("😍️Back-end started!");
});
