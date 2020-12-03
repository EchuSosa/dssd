import axios from "axios";

export const createProject = async (name, description) => {
  const response = await axios
    .post("http://localhost:5000/createNewProject", {
      name: name,
      description: description,
    })
    .then((response) => {
      console.log("####", response)
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default createProject;
