import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import "./Login.css";
import appLogin from "../service/login-services";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [error, showError] = useState(false);
  const history = useHistory();

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  };

  const storageData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.currentUser[0].userName);
    localStorage.setItem("userId", data.currentUser[0].id);
    localStorage.setItem("userRole", data.currentUser[0].job_title);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data } = await appLogin(username, password);
    if (data) {
      setHasToken(data.token);
      setJobTitle(data.currentUser[0].job_title);
      storageData(data);
      //Una vez que sepamos como recuperar los roles
      //podemos derivar a la vista de jefe o responsable
      if (data.currentUser[0].job_title === "Jefe de Proyecto") {
        history.push("/projectconf");
      }
      if (data.currentUser[0].job_title === "Responsable de protocolo") {
        history.push("/protocolexec");
      }
      if (data.currentUser[0].job_title === "") {
        showError(true)
      }
    } else {
      showError(true);
    }
  };

  return (
    <>
      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div>
            <Button
              variant="dark"
              block
              size="lg"
              type="submit"
              disabled={!validateForm()}
            >
              Login
            </Button>
          </div>
          {error && <div className="error">Usuario y/o contraseña incorrectos</div>}
          
        </Form>
      </div>
    </>
  );
}
