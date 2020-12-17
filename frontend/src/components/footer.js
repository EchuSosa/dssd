import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FaCodeBranch, FaGraduationCap,FaLaptopCode } from 'react-icons/fa';

class AppNavbar extends React.Component {
  render() {    

    return (
      <>
         <div className="fixed-bottom " >  
            <Navbar bg="secondary" variant="secondary">
                
                    <Navbar.Brand className='m-auto' style={{"color":"white","font-size":"14px"}}>
                    <FaGraduationCap color="white" size={25} /> DSSD-2020  </Navbar.Brand>
                    <Navbar.Brand className='m-auto' style={{"color":"white","font-size":"14px"}}>
                    <FaCodeBranch color="white" size={25} /> GRUPO 1  </Navbar.Brand>
                    <Navbar.Brand className='m-auto' style={{"color":"black","font-size":"14px"}}>
                    <FaLaptopCode color="white" size={25} /> [ Faraone Camila -  Sosa Ester - Bellino Franco  ] </Navbar.Brand>

            </Navbar>
        </div>
      </>
    );
  }
}
export default AppNavbar;
