const { Pool } = require("pg");
const model = require("../database/models/Index");
const Bonita = require("./bonita.controller");
const bonita = require("../model/bonita");
const bonita_url = "http://localhost:8080/bonita";
const Protocol = require("./protocol.controller");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getProjects = async (req, res) => {
  try {
    const projects = await model.Project.findAll();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const setStatus = async (req, res) => {
  try {
    const { parentCaseId } = req.body;
    const params = [{ status: "ejecutando" }];
    const project = await model.Project.update(params[0], {
      where: { bonitaIdProject: parentCaseId },
    });
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
const setStatusIniciado = async (req,res) => {
  try {
    const { id } = req.params
    const params = [{ status: "iniciado" }];
    const project = await model.Project.update(params[0], {
      where: { bonitaIdProject: id },
    });
    return res.status(200);
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

const getProjectByBonitaId = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await model.Project.findOne({
      where: { bonitaIdProject: id },
    });
    if (project) {
      return res.status(200).json(project);
    }
    return res
      .status(404)
      .json({ message: "Project with the specified ID does not exists" });
  } catch (error) {
    return res.status(500).json(error.message);
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

const updateProjectByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    const [updated] = await model.Project.update(req.body, {
      where: { bonitaIdProject: caseId },
    });
    if (updated) {
      const updatedProject = await model.Project.findOne({
        where: { bonitaIdProject: caseId },
      });
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


/**
 * @fb
 * @param {*} req
 * @param {*} res
 */
const approveProject = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const response = await Bonita.approveProject(id,userId);
    if (response) {
      return res.status(200).json({ status: "Project Approved" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 * @param {*} req
 * @param {*} res
 */
const restartProject = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    var response = await Protocol.restartAllProtocolsByProject(req, res);
    await setStatusIniciado(req,res)
    //-------------------------------Codigo para setear el orden de ejec en bonita--------------
    var minOrder = await model.Protocol.min("order", {
        where: { project_id: id },
      });
    minOrder = minOrder-1
    const response2 = await bonita.setOrder(id, minOrder)

    if (response2) {
        const decision = "reiniciar"
        response = await bonita.setDecision(id,decision);
        if (response){
          const stats = "iniciado"
          response = await bonita.setStatus(id, stats);
          response =  await bonita.advanceTask(id, userId);     
          return res.status(200).json({ status: "Project Restarted" });     
        }
      return res.status(500).json({ status: "Error en restart" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

const createBonitaProject = async (req, res) => {
  try {
    const bonita = await Bonita.login();
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
  getProjectsByUserIdAndProjectId,
  setStatus,
  updateProjectByCaseId,
  getProjectByBonitaId,
  approveProject,
  restartProject,
  setStatusIniciado
};
