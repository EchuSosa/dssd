import React from 'react';
import { Navbar, Nav } from "react-bootstrap";

class AppNavbar extends React.Component {    
    
    render() {
        const uid= localStorage.getItem("userId") ? localStorage.getItem("userId") : null;

        const handleLogout = () => {
            localStorage.clear(); 

        };

        
        return (
            <>
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="#home">Navbar</Navbar.Brand>
    { uid ?  
              <Nav className="ml-auto">                  
                <Nav.Link                 
                onClick={handleLogout}
                href="/"
                >
                Logout</Nav.Link>
              </Nav>  
              :
              <Nav className="ml-auto">                  
              <Nav.Link href="#home">Login</Nav.Link>
            </Nav>          
    }
            </Navbar>            
          </>
        )
    }
};
export default AppNavbar;