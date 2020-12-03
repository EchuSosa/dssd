import axios from "axios";

export const getAll = async (id) => {
  console.log(`http://localhost:5000/projects/user/${id}`)
  const response = await axios
    .get(`http://localhost:5000/projects/user/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default getAll;
