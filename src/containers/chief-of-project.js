import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Table, Modal } from "react-bootstrap";

import ProjectService from "../service/project-service";
import "./Chief.css";
import Navbar from "../components/navbar";

export default function ChiefOfProject() {
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  //TODO Verificar si se deshabilita el botón de iniciar una vez que lo iniciamos
  const [disabledButton, setDisabledButton] = useState(false);

  const history = useHistory();

  const validateForm = () => {
    return name.length > 0 && endDate;
  };

  const getProjects = async () => {
    const { data, status } = await ProjectService.getAll(
      localStorage.getItem("userId")
    );
    if (status === 200 && data) {
      setProjects(data.response);
    }
  };

  useEffect(() => {
    getProjects();
  }, [disabledButton]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await ProjectService.createProject(name, endDate);
      if (response && response.status === 200 && response.data) {
        //Una vez que está creado el proyecto podemos correr la primera tarea
        await ProjectService.startActivity(response.data.id);
      } else {
        console.log("Error al crear el proyecto");
      }
    } catch (e) {
      console.log("Error al crear el proyecto");
    }
  };

  const handleShowProtocols = async () => {};

  const startProject = async (projectId) => {
    const { data } = await ProjectService.getProtocolsByProject(projectId);
    if (data.protocol.length === 0) {
      setModalMessage(
        "Para poder iniciar un proyecto, debe agregarse al menos un protocolo."
      );
      handleShow();
    } else {
      const response = await ProjectService.startActivity(projectId);
      setDisabledButton(true);
      handleShow();
      setModalMessage("El proyecto ha sido inicializado correctamente.");
    }
  };

  const formatDate = (date) => {
    return date.split(" ")[0].split("-").reverse().join("-");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="chief-body">
        <Form onSubmit={handleSubmit}>
          <h3>Crear un nuevo Proyecto</h3>
          <Form.Group controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del proyecto"
            />
          </Form.Group>
          <Form.Group size="lg" controlId="endDate">
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit" disabled={!validateForm()}>
            Guardar
          </Button>
        </Form>
        <div className="mt-5">
          <h3>Proyectos creados</h3>
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th colspan="2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map((project) => (
                  <tr>
                    <td>{project.id}</td>
                    <td>{project.state === "started" && "Creado"}</td>
                    <td>{formatDate(project.start)}</td>
                    <td>
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => {
                          handleShowProtocols();
                          history.push(`/projects/${project.id}/protocols`);
                        }}
                      >
                        Ver Protocolos
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => startProject(project.id)}
                        disabled={disabledButton}
                      >
                        Iniciar Proyecto
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
