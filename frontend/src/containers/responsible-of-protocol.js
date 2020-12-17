import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FaBolt } from 'react-icons/fa';

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./Protocol.css";
import ProtocolService from "../service/protocol-service";
import ProjectService from "../service/project-service";

const ResponsibleOfProtocol = () => {
  const [show, setShow] = useState(false);
  const [protocols, setProtocols] = useState([]);
  const [score, setScore] = useState(null);
  const [idProtocol, setIdProtocol] = useState(false);
  const [idProject, setIdProject] = useState(false);

  // Modal
  const handleClose = () => setShow(false);

  const handleShow = (id, idProject) => {
    setIdProject(idProject);
    setIdProtocol(id);
    setShow(true);
  };

  const validateForm = () => {
    return score && score >= 0 && score <= 10;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShow(false);
    await ProtocolService.executeProtocol(
      idProtocol,
      idProject,
      score,
      localStorage.getItem("userId")
    );
    getProtocols();
  };

  //Casos activos de bonita
  const getAllActiveCases = async () => {
    return await ProjectService.getAllActiveCases();
  };

  //Protocolos por usuario actual de bd
  const getProtocolsByUser = async () => {
    return await ProtocolService.getProtocolsByUser(
      localStorage.getItem("userId")
    );
  };

  //Proyectos executados de la bd
  const startedProjects = async () => {
    await ProjectService.getStartedProjects();
  };

  const getProtocols = async () => {
    try {
      const bonitaCases = await getAllActiveCases();
      const { data } = await getProtocolsByUser();
      const startedProjectsFromDB = await startedProjects();

      let projectsIdFromBonita = [];
      bonitaCases.data.map((d) => {
        if (!projectsIdFromBonita.includes(d.rootCaseId))
          projectsIdFromBonita.push(d.rootCaseId);
      });

      let filterProtocols = data.filter((element) =>
        projectsIdFromBonita.includes(element.project_id)
      );

      let filterProtocolsLocal = filterProtocols.filter(
        (element) => element.isLocal === 1
      );
      setProtocols(filterProtocolsLocal);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProtocols();
  }, []);

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
        { protocols.length > 0 ? 
        <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Id</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Nombre</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Orden</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Id Proyecto</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Estado</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Acción</th>
          </tr>
        </thead>
        <tbody>
          {protocols.length > 0 &&
            protocols.map((protocol) => (
              <tr>
                <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.id}</td>
                <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.name}</td>
                <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.order}</td>
                <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.project_id}</td>
                <td style={{"text-align": "center","vertical-align":"middle"}}>{!protocol.started ? "Ready" : "Started"}</td>
                <td style={{"text-align": "center","vertical-align":"middle"}}>
                  {!protocol.executed && (
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleShow(protocol.id, protocol.project_id)
                      }
                    >
                    <FaBolt color="white" size={20} />  Ejecutar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
       : "No hay protocolos para ejecutar" }
        
      </div>
      <Footer />
    </>
  );
};

export default ResponsibleOfProtocol;
