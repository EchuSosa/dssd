import axios from "axios";

const API_URL = "http://localhost:5000";

const getAll = async (id) => {
  const response = await axios
    .get(`${API_URL}/protocols/project/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const createProtocol = async (
  name,
  responsible,
  orden,
  local,
  startDate,
  endDate,
  projectid
) => {
  const response = await axios
    .post(`${API_URL}/protocols`, {
      name: name,
      user_id: responsible,
      order: orden,
      isLocal: local,
      startDate: startDate,
      endDate: endDate,
      project_id: projectid,
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

const getProtocolsByUser = async (userId) => {
  const response = await axios
    .get(`${API_URL}/protocols/user/${userId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {});
  return response;
};

const getProtocolsByProjectId = async (projectId) => {
  const response = await axios
    .get(`${API_URL}/protocols/project/${projectId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {});
  return response;
};

const executeProtocol = async (id, score, projectId,userId) => {
  const response = await axios
    .put(`${API_URL}/protocols/${id}/approve`, {
      id: id,
      score: score,
      projectId:projectId,
      userId:userId
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
  getAll,
  createProtocol,
  getProtocolsByUser,
  executeProtocol,
  getProtocolsByProjectId,
};
