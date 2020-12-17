const Bonita = require("../model/bonita");
const model = require("../database/models/Index");
const Protocol = require("./protocol.controller");

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const getTokenLogin = async (req, res) => {
  try {
    const { username, password } = { ...req.body };
    const response = await Bonita.login(username, password);
    if (response && response.status) {
      //Acomodar el pasamanos del process definition
      let proccesessDefinitions = await Bonita.getProcessDefinitions();
      let proccesDefinition = proccesessDefinitions.find(
        (processDef) => processDef.name == "Laboratorio"
      );
      Bonita.setProcessDefinition(proccesDefinition.id);
      const currentUser = await Bonita.getUserId(username);
      const token = response.token;
      return res.status(200).json({ token, currentUser });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const createNewProject = async (req, res) => {
  try {
    const newProject = await Bonita.newProject();
    if (newProject) {
      model.Project.create({
        name: req.body.name,
        user_id: newProject.started_by,
        startDate: newProject.start,
        endDate: req.body.endDate
          ? new Date(req.body.endDate).toUTCString()
          : null,
        bonitaIdProject: newProject.id,
      }).catch((e) => console.log("Error", e));
      return res.status(200).json(newProject);
    } else {
      return res.status(400).json({});
    }
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const advanceTaskBack = async (req, res) => {
  try {
    const response = await Bonita.advanceTask(req.body.id);
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
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
const deleteCase = async (req, res) => {
  try {
    const { caseId } = req.params
    const response = await Bonita.deleteCase(caseId);
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
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
const approveProject = async (projectId,userId) => {
  try {
    const decision = "fin"
    const response = await Bonita.setDecision(projectId,decision);    
    if (response) {
      response = await Bonita.advanceTask(projectId,userId);    
      return response;
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
const restartProtocol = async (req, res) => {
  try {
    const { userId } = req.body
    const response = await Protocol.restartProtocol(req,res);
    if (response) {
      return res.status(200).json({ status: "Protocol Restarted" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};



/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const getProcessDefinitions = async (req, res) => {
  try {
    const response = await Bonita.getProcessDefinitions();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const createCase = async (req, res) => {
  try {
    const response = await Bonita.createCase();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @echu
 * @param {*} req
 * @param {*} res
 */
const getIdTask = async (req, res) => {
  try {
    const response = await Bonita.getIdTask();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};


const getCasesByUser = async (req, res) => {
  try {
    arr = []
    var project;
    var state, name;
    const { idUser } = req.params;
    const response = await Bonita.getActiveCases(idUser);
    
    for(var key in response)
    {
      var id = response[key].id
      project = await model.Project.findOne({
        where: { bonitaIdProject: id     
         },
      });
      if (!project) {
        state = 'iniciado'
        name = 'Nuevo'
      }else{
        state = project.status
        name = project.name
      }
      const decision = await Bonita.getDecision(id)
      response[key]["currentState"] = state;
      response[key]["currentDecision"] = decision;
      response[key]["name"] = name;
      arr.push(response[key])


    }
   
    if (response) {   
      return res.status(200).json({ response });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

const testAllFlow = async (req, res) => {
  try {
    const response = await Bonita.testAllFlow();
    if (response) {
      return res.status(200).json({ status: "Task advanced" });
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

const startActivity = async (req, res) => {
  try {
    const { parentCaseId, userId } = req.body;
    //const idActivity = await Bonita.getActivity(parentCaseId);
    //await Bonita.updateTask(idActivity[0].id);
    const response = await Bonita.advanceTask(parentCaseId,userId);
    if (response) {
      return res.status(200).json();
    }
    return res.status(400).json({});
  } catch (e) {
    console.log("falla en startActivity", e);
    return res.status(403);
  }
};

const assignActivity = async (req, res) => {
  try {
    const { parentCaseId } = req.body;
    const { userId } = req.body;
    
    const response = await Bonita.assignActivity(parentCaseId, userId);    
    if (response) {
      return res.status(200).json();
    }
    return res.status(400).json({});
  } catch (e) {
    console.log("falla al asignar la actividad", e);
    return res.status(403);
  }
};

const getAllActiveCases = async (req, res) => {
  try {
    const response = await Bonita.getAllActiveCases();
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};


/**
 * @fb
 */
const getGroupId = async (req, res) => {
  try {
    const id  = await Bonita.getGroupId();
    if (id) {
      return id[0].id;
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 */
const getAllUsers = async (req, res) => {
  try {
    const group_id = await getGroupId();
    const response = await Bonita.getAllUsers(group_id);
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};

/**
 * @fb
 */
const getCurrentActivity = async (req, res) => {
  try {
    const { parentCaseId } = req.params
    const response = await Bonita.getActivity(parentCaseId);
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({});
  } catch (e) {
    return res.status(403);
  }
};


module.exports = {
  getTokenLogin,
  advanceTaskBack,
  getProcessDefinitions,
  createCase,
  getIdTask,
  testAllFlow,
  createNewProject,
  getCasesByUser,
  startActivity,
  getAllActiveCases,
  getGroupId,
  getAllUsers,
  getCurrentActivity,
  assignActivity,
  deleteCase,
  restartProtocol,
  approveProject
};

