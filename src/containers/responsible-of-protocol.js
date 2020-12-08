import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Navbar from "../components/navbar";
import "./Protocol.css";
import ProtocolService from "../service/protocol-service";
import ProjectService from "../service/project-service";

const ResponsibleOfProtocol = () => {
  const [show, setShow] = useState(false);
  const [protocols, setProtocols] = useState([]);
  const history = useHistory();

  // Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    /*TODO
    Crear un servicio para pegarle al back y actualice el estado de la tarea a completado
    Ver el tema del score*/
  };

  const fetchData = async () => {
    try {
      //Casos activos de bonita
      const bonitaCases = await ProjectService.getAllActiveCases();
      //Protocolos por usuario actual de bd
      const { data, status } = await ProtocolService.getProtocolsByUser(
        localStorage.getItem("username")
      );
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="protocol-list">
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
              <th>Id Proyecto</th>
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
                  <td>
                    <Button variant="danger" onClick={handleShow}>
                      Ejecutar
                    </Button>
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
