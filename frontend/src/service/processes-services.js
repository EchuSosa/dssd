import axios from "axios";

export const advanceTask = async (id) => {
  const response = await axios
    .post("http://localhost:5000/advanceTask", {
      id: id,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default advanceTask;
