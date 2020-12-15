import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";

import Navbar from "../components/navbar";
import Button from "react-bootstrap/Button";
import "./Login.css";
import AuthService from "../service/auth-service";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  };

  const storageData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.currentUser[0].userName);
    localStorage.setItem("userId", data.currentUser[0].id);
    localStorage.setItem("jobTitle", data.currentUser[0].job_title);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await AuthService.login(username, password);
      if (response.status === 200 && response.data) {
        storageData(response.data);
        //Una vez que sepamos como recuperar los roles
        //podemos derivar a la vista de jefe o responsable
        if (response.data.currentUser[0].job_title === "Jefe de Proyecto") {
          history.push("/projectconf");
        }
        if (
          response.data.currentUser[0].job_title === "Responsable de protocolo"
        ) {
          history.push("/protocolexec");
        }
        if (response.data.currentUser[0].job_title === "") {
          setError("Error");
          setShowError(true);
        }
      } else {
        setError("Usuario y/o contraseña incorrectos");
        setShowError(true);
      }
    } catch (error) {
      setError("Usuario y/o contraseña incorrectos");
      setShowError(true);
    }
  };

  return (
    <>
      <Navbar />
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
          {showError && <div className="error">{error}</div>}
        </Form>
      </div>
    </>
  );
}
