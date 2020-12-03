import axios from "axios";

export const getAll = async (id) => {
  const response = await axios
    .get(`http://localhost:5000/protocols/project/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default getAll;
