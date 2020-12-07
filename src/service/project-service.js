import axios from "axios";

const API_URL = "http://localhost:5000/";

const getAll = async (id) => {
  const response = await axios
    .get(`${API_URL}getActiveCases/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

const getActivity = async (parentCaseId) => {
  const response = await axios
    .post(`${API_URL}activity`, { parentCaseId: parentCaseId })
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
  getActivity,
};
