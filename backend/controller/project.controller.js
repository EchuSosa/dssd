const { Pool } = require("pg");
const model = require("../database/models/Index");
const Bonita = require("./bonita.controller");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getProjects = async (req, res) => {
  try {
    const projects = await model.Project.findAll();
    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await model.Project.findOne({
      where: { id: id },
    });
    if (project) {
      return res.status(200).json({ project });
    }
    return res
      .status(404)
      .send("Project with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};



const getStartedProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await model.Project.findAll({
      where: { started: true },
    });
    if (project) {
      return res.status(200).json(project);
    }
    return res
      .status(404)
      .json({ status: "Project with the specified ID does not exists" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getProjectsByUserId = async (req, res) => {
  try {
    const { idUser } = req.params;
    const project = await model.Project.findAll({
      where: { user_id: idUser },
    });
    if (project) {
      return res.status(200).json({ project });
    }
    return res
      .status(404)
      .send("Project with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getProjectsByUserIdAndProjectId = async (req, res) => {
  try {
    const { idUser, idProject } = req.params;
    const project = await model.Project.findAll({
      where: { user_id: idUser, project_id: idProject },
    });
    if (project) {
      return res.status(200).json({ project });
    }
    return res
      .status(404)
      .send("Project with the specified ID does not exists");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createProject = async (req, res) => {
  try {
    const project = await model.Project.create(req.body);
    return res.status(201).json({
      project,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await model.Project.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedProject = await model.Project.findOne({ where: { id: id } });
      return res.status(200).json({ project: updatedProject });
    }
    throw new Error("Project not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await model.Project.destroy({
      where: { id: id },
    });
    if (deleted) {
      return res.status(204).send("Project deleted");
    }
    throw new Error("Project not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createBonitaProject = async (req, res) => {
  try {
    const bonita = await Bonita.login();
    console.log(await bonita.token);
    return bonita;
  } catch (e) {
    return "Error en create bonita project -> " + e;
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectsByUserId,
  createProject,
  updateProject,
  deleteProject,
  createBonitaProject,
  getStartedProjects,
  getProjectsByUserIdAndProjectId
};
