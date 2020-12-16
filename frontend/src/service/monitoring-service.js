import axios from "axios";

const API_URL = "http://localhost:5000";

const getAll = async () => {
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

export default {
  getAll,
};
