//------------------------------REQUIRES-----------------------------------------------------------------------------------------------------------------------------
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const { Router } = require("express");
const router = Router();
//const user = require("../controller/user.controller");
//const auth = require("../controller/auth.controller");
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get("/", (req, res) => res.render("../views/pages/index.ejs"));

//------------------------------USERS ROUTES-----------------------------------------------------------------------------------------------------------------------------

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------PROTOCOLS ROUTES--------------------------------------------------------------------------------------------------------
const {
  getProtocols,
  getProtocolById,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  startProtocol,
  approveProtocol,
  getProtocolsByProject,
  getProtocolsByUser,
  getProtocolsByProjectId,
  getNextProtocol,
  executeRemoteProtocol,
  createRemoteProtocol,
  getRemoteValue,
} = require("../controller/protocol.controller");

router.get("/protocols", getProtocols);
router.get("/protocols/:id", getProtocolById);
router.get("/protocols/project/:id", getProtocolsByProject);
router.get("/protocols/project/:idProject/:current", getNextProtocol);
router.get("/protocols/user/:userId", getProtocolsByUser);
router.get("/bonita/protocols/project/:projectId", getProtocolsByProjectId);
router.post("/protocols", createProtocol);
router.put("/protocols/:id", updateProtocol);
router.put("/protocols/:id/start", startProtocol);
router.put("/protocols/:id/approve", approveProtocol);
router.delete("/protocols/:id", deleteProtocol);
router.post("/remote/protocols", createRemoteProtocol);
router.put("/remote/protocol/:id", executeRemoteProtocol);
router.get("/remote/protocol/:id", getRemoteValue);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------PROJECTS ROUTES-----------------------------------------------------------------------------------------------------------------------------

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUserId,
  getStartedProjects,
  getProjectsByUserIdAndProjectId,
  updateProjectByCaseId,
  getProjectByBonitaId,
} = require("../controller/project.controller");
router.get("/projects/add", (req, res) =>
  res.render("../views/pages/newProject.ejs")
);
router.get("/projects", getProjects);
router.get("/projects/started", getStartedProjects);
router.get("/projects/:id", getProjectById);
router.get("/projects/user/:idUser", getProjectsByUserId);
router.get(
  "/projects/user/:idUser/project/:idProject",
  getProjectsByUserIdAndProjectId
);
router.get("/projects/bonita/:id", getProjectByBonitaId);
router.put("/projects/:id", updateProject);
router.put("/projects/case/:caseId", updateProjectByCaseId);

router.delete("/projects/:id", deleteProject);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*
//--------------------------------TEST ROUTES----------------------------------------------------------------------------------------------------------------------------------------
router.get("/api/test/all", user.allAccess);
router.get("/api/test/user", [authJwt.verifyToken], user.userBoard);
router.get(  "/api/test/mod",  [authJwt.verifyToken, authJwt.isModerator],  user.moderatorBoard);
router.get(  "/api/test/admin",  [authJwt.verifyToken, authJwt.isAdmin],  user.adminBoard
);
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
//-------------------------------LOGIN ROUTES-----------------------------------------------------------------------------------------------------------------------------

const { signup, signin } = require("../controller/auth.controller");

router.post(
  "/api/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  signup
);
router.post("/api/auth/signin", signin);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------Bonita ROUTES-----------------------------------------------------------------------------------------------------------------------------

const {
  getTokenLogin,
  advanceTaskBack,
  getProcessDefinitions,
  createCase,
  getIdTask,
  testAllFlow,
  createNewProject,
  getCasesByUser,
  startActivity,
  assignActivity,
  getAllActiveCases,
  getAllUsers,
  getCurrentActivity,
  deleteCase,
  restartProtocol,
} = require("../controller/bonita.controller");

router.post("/getTokenLogin", getTokenLogin);
router.post("/getProcessDefinitions", getProcessDefinitions);
router.post("/createCase", createCase);
router.post("/getIdTask", getIdTask);
router.post("/advanceTask", advanceTaskBack);
router.post("/testAllFlow", testAllFlow);
router.post("/createNewProject", createNewProject);
router.get("/getAllProjectWithOutAuth", getProjects);
router.get("/getActiveCases/:idUser", getCasesByUser);
router.get("/getAllActiveCases", getAllActiveCases);
router.post("/startActivity", startActivity);
router.post("/assignActivity", assignActivity); //camb
router.get("/bonita/users", getAllUsers);
router.get("/bonita/activity/:parentCaseId", getCurrentActivity);
router.delete("/bonita/:caseId", deleteCase);
router.put("/bonita/protocol/:idProtocol", restartProtocol);

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

router.use(function (req, res) {
  // Invalid request
  res.json({
    error: {
      name: "Error",
      status: 404,
      message: "Invalid Request",
      statusCode: 404,
    },
    message: "The specified route does not exist!",
  });
});
//
module.exports = router;
