import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";

import Navbar from "../components/navbar";
import "./Protocol.css";
import ProtocolService from "../service/protocol-service";
import ProjectService from "../service/project-service";

const ResponsibleOfProtocol = () => {
  const [show, setShow] = useState(false);
  const [protocols, setProtocols] = useState([]);
  const [score, setScore] = useState(null);
  const [idProtocol, setIdProtocol] = useState(false);

  // Modal
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setIdProtocol(id);
    setShow(true);
  };

  const validateForm = () => {
    return score && score >= 0 && score <= 10;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShow(false);
    await ProtocolService.executeProtocol(idProtocol, score);
  };

  const fetchData = async () => {
    try {
      //Casos activos de bonita
      const bonitaCases = await ProjectService.getAllActiveCases();
      //Protocolos por usuario actual de bd
      const { data, status } = await ProtocolService.getProtocolsByUser(
        localStorage.getItem("username")
      );
      if (bonitaCases && bonitaCases.data && status === 200 && data) {
        //Me quedo solo con los rootCaseId activos de bonita
        let projectsIdFromBonita = [];
        bonitaCases.data.map((d) => {
          if (!projectsIdFromBonita.includes(d.rootCaseId))
            projectsIdFromBonita.push(d.rootCaseId);
        });
        //Filtro de los protocolos de DB que solamente esten en los casos activos de bonita
        let filterProtocols = data.filter((element) =>
          projectsIdFromBonita.includes(element.project_id)
        );
        //Seteo para mostrar en la vista solo el filtro
        setProtocols(filterProtocols);
      } else {
        console.log("Error al cargar los protocolos");
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
  

  return (
    <>
      <Navbar />
      <div className="protocol-list">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Ejecutar protocolo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group size="lg" controlId="protocolId">
              <Form.Label>Id de protocolo: {idProtocol}</Form.Label>
            </Form.Group>
            <Form.Group size="lg" controlId="score">
              <Form.Label>Seleccione un puntaje del 1 al 10</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                min="0"
                max="10"
                onChange={(e) => setScore(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!validateForm()}
            >
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
              <th>Id Proyecto</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {protocols.length > 0 &&
              protocols.map((protocol) => (
                <tr>
                  <td>{protocol.id}</td>
                  <td>{protocol.name}</td>
                  <td>{protocol.project_id}</td>
                  <td>{!protocol.started ? "Ready" : "Started"}</td>
                  <td>
                    {!protocol.started && (
                      <Button
                        variant="danger"
                        onClick={() => handleShow(protocol.id)}
                      >
                        Ejecutar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ResponsibleOfProtocol;
