import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import AuthService from "../service/auth-service";

class AppNavbar extends React.Component {
  render() {
    const uid = localStorage.getItem("userId")
      ? localStorage.getItem("userId")
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
              <Nav.Link onClick={handleLogout} href="/monitoring">
                Monitoreo
              </Nav.Link>
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
