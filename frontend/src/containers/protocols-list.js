import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import ProtocolService from "../service/protocol-service";

import Navbar from "../components/navbar";
import Protocol from "./protocol";

const ProtocolsList = (props) => {
  const [show, setShow] = useState(false);
  const [protocols, setProtocols] = useState([]);

  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const goBack = () => {
    history.push("/projectconf");
  };

  const restartProtocol = async (idProtocol) => {
    const userId = localStorage.getItem("userId")
    const response = await ProtocolService.restart(idProtocol,userId);
    console.log(response)
    alert("restarteado")
  };
  
  const getProtocols = async () => {
    const { data } = await ProtocolService.getAll(props.match.params.id);
    setProtocols(data.protocol);
  };

  useEffect(() => {
    getProtocols();
  }, [setProtocols]);

  return (
    <>
      <Navbar />
      <div className="protocol-list">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Protocolo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Protocol
              projectId={props.match.params.id}
              protocols={protocols}
              setProtocols={setProtocols}
              showModal={setShow}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="header">
          <h3>Listado de protocolos del proyecto</h3>
          <Button variant="success" onClick={handleShow}>
            + Agregar Protocolo
          </Button>
        </div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Responsable</th>
              <th>Orden</th>
              <th>Lugar de ejeccucion</th>
              <th>Puntaje</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {protocols.length > 0 &&
              protocols.map((protocol) => (
                <tr>
                  <td>{protocol.id}</td>
                  <td>{protocol.name}</td>
                  <td>{protocol.user_id}</td>
                  <td>{protocol.order}</td>
                  <td>{protocol.isLocal == 1 ? 'Local':'Remoto'}</td>
                  <td>{protocol.score == null ? 'Sin puntaje': protocol.score}</td>
                  <td>
                      {            
                      ( protocol.score !== null  ) ?
                      (  <Button variant="danger" size="sm" onClick={() => restartProtocol(protocol.id)}
                        
                        >
                          Reiniciar ejecuccion
                      </Button> ) : ("")
                       
                      }
                    </td>                   
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="goBack">
          <Button variant="link" onClick={goBack}>
            Volver a los proyectos
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProtocolsList;
