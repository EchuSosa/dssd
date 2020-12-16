import axios from "axios";

const API_URL = "http://localhost:5000";

const getAllByUser = async (id) => {
  const response = await axios
    .get(`${API_URL}/getActiveCases/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getProjectsByUserId = async (id) => {
  const response = await axios
    .get(`${API_URL}/bonita/projects/user/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getProjects = async () => {
  const response = await axios
    .get(`${API_URL}/projects`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getProjectByBonitaId = async (id) => {
  const response = await axios
    .get(`${API_URL}/projects/bonita/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getProjectsByUserIdAndProjectId = async (idUser, idProject) => {
  const response = await axios
    .get(`${API_URL}/projects/user/${idUser}/project/${idProject}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getStartedProjects = async () => {
  const response = await axios
    .get(`${API_URL}/projects/started`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const startActivity = async (parentCaseId, userId) => {
  const response = await axios
    .post(`${API_URL}/startActivity`, {
      parentCaseId: parentCaseId,
      userId: userId,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const assignActivity = async (parentCaseId, userId) => {
  const response = await axios
    .post(`${API_URL}/assignActivity`, {
      parentCaseId: parentCaseId,
      userId: userId,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const createProject = async (name, endDate) => {
  const response = await axios
    .post(`${API_URL}/createNewProject`, {
      name: name,
      endDate: endDate,
      started: false,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getProtocolsByProject = async (idProject) => {
  const response = await axios
    .get(`${API_URL}/protocols/project/${idProject}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getAllActiveCases = async () => {
  const response = await axios
    .get(`${API_URL}/getAllActiveCases`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getCurrentActivity = async (parentCaseId) => {
  const response = await axios
    .get(`${API_URL}/bonita/activity/${parentCaseId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const deleteProject = async (id) => {
  const response = await axios
    .delete(`${API_URL}/bonita/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const updateProject = async (caseId) => {
  const response = await axios
    .put(`${API_URL}/projects/case/${caseId}`, {
      status: "ejecutando",
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default {
  getAllByUser,
  startActivity,
  getProjectsByUserId,
  createProject,
  getProtocolsByProject,
  getAllActiveCases,
  getCurrentActivity,
  assignActivity,
  getStartedProjects,
  getProjectsByUserIdAndProjectId,
  deleteProject,
  updateProject,
  getProjectByBonitaId,
  getProjects,
};
