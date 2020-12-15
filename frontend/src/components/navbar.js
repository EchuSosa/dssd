import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import AuthService from "../service/auth-service";

class AppNavbar extends React.Component {
  render() {
    const uid = localStorage.getItem("userId")
      ? localStorage.getItem("userId")
      : null;

    const jobTitle = localStorage.getItem("jobTitle")
      ? localStorage.getItem("jobTitle")
      : null;

    const handleLogout = () => {
      AuthService.logout();
    };

    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">DSSD - Grupo 1</Navbar.Brand>
          {uid ? (
            <Nav className="ml-auto">
              {jobTitle === "Jefe de Proyecto" && (
                <>
                  <Nav.Link href="/projects/monitoring">Monitoreo</Nav.Link>
                  <Nav.Link href="/projectconf">
                    Configuración de Proyectos
                  </Nav.Link>
                </>
              )}
              {jobTitle === "Responsable de protocolo" && (
                <Nav.Link href="/protocolexec">
                  Ejecución de protocolos
                </Nav.Link>
              )}
              <Nav.Link onClick={handleLogout} href="/">
                Logout
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="ml-auto">
              <Nav.Link href="/">Login</Nav.Link>
            </Nav>
          )}
        </Navbar>
      </>
    );
  }
}
export default AppNavbar;
