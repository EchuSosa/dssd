import axios from "axios";

export const createProtocol = async (name, projectid, uname, orden) => {
  const response = await axios
    .post("http://localhost:5000/protocols", {
      name: name,
      project_id: projectid,
      username:uname,
      isLocal:'1',
      order:orden
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default createProtocol;
