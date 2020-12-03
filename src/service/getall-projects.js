import axios from "axios";

export const getAllProject = async (name, endDate) => {
  const response = await axios
    .get("http://localhost:5000/getAllProjectWithOutAuth")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default getAllProject;