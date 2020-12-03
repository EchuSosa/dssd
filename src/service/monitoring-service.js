import axios from "axios";

export const getAll = async () => {
  const response = await axios
    .get("http://localhost:5000/projects")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default getAll;
