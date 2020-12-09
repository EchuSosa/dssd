import axios from "axios";

const  getAll = async () => {
  const response = await axios
    .get("http://localhost:5000/bonita/users")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default getAll;
