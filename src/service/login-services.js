import axios from "axios";

export const appLogin = async (username, password) => {
  const response = await axios
    .post("http://localhost:5000/getTokenLogin", {
      username: username,
      password: password,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};

export default appLogin;
