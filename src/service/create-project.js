import axios from "axios";

export const createProject = async (name, endDate) => {
  const response = await axios
    .post("http://localhost:5000/createNewProject", {
      name: name,
      endDate: endDate,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default createProject;
