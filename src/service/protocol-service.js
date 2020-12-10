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
      username: responsible,
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

const getProtocolsByUser = async (username) => {
  const response = await axios
    .get(`${API_URL}/protocols/user/${username}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {});
  return response;
};

const executeProtocol = async (id, score) => {
  const response = await axios
    .put(`${API_URL}/protocols/${id}/approve`, {
      id: id,
      score: score,
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
};
