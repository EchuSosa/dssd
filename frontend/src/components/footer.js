import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FaLaptopMedical } from 'react-icons/fa';
import AuthService from "../service/auth-service";

class AppNavbar extends React.Component {
  render() {    

    return (
      <>
         <div className="fixed-bottom " >  
            <Navbar bg="secondary" variant="secondary">
                
                    <Navbar.Brand className='m-auto' style={{"color":"white"}}> DESARROLLO DE SOFTWARE EN SISTEMAS DISTRIBUIDOS 2020  </Navbar.Brand>
                    <Navbar.Brand className='m-auto' style={{"color":"white"}}>  GRUPO 1  </Navbar.Brand>
                    <Navbar.Brand className='m-auto' style={{"color":"white"}}> FARAONE CAMILA - SOSA ESTER - BELLINO FRANCO </Navbar.Brand>

            </Navbar>
        </div>
      </>
    );
  }
}
export default AppNavbar;
