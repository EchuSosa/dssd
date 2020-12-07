import axios from "axios";

const API_URL = "http://localhost:5000/";

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}getTokenLogin`, {
      username: username,
      password: password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
};

export default {
  login,
  logout,
};
