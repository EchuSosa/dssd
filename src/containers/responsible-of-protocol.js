import React, { useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import "./Protocol.css";

// Datos para testear la tabla hay que borrarlos cuando consumamos de bonita
const dataTest = { id: "1", nombre: "Protocolo Test" }

const ResponsibleOfProtocol = (props) => {
  const [show, setShow] = useState(false);
  const [protocols, setProtocols] = useState([dataTest]);
  const history = useHistory();
  
  // Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Crea nuevo protocolo");
  };

  return (
    <div class="protocol-list">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Protocolo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Está seguro/a de iniciar la ejecución del protocolo?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Ejecutar
          </Button>
        </Modal.Footer>
      </Modal>
      <h3>Protocolos disponibles para ejecutar</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {protocols.length > 0 && protocols.map(
            protocol => (
              <tr>
                <td>{protocol.id}</td>
                <td>{protocol.nombre}</td>
                <td><Button variant="danger" onClick={handleShow}>Ejecutar</Button></td>
              </tr>
            )
          )}  
        </tbody>
      </Table>
    </div>
  );
};

export default ResponsibleOfProtocol;
