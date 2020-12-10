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
  const [setear, setSetear] = useState([]);
  const [show, setShow] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [proyectIdRegister, setProyectIdRegister] = useState(null);

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
      setears();
    }
  };

  const setears = () => {
    projects.map(async (project) => {
      let activities = await ProjectService.getCurrentActivity(project.id);
      if (activities.data[0].name === "Crear Proyecto") {
        setSetear((setear) => [...setear, parseInt(project.id)]);
      }
    });
  };

  const getCurrentActivity = async (id) => {
    const { data, status } = await ProjectService.getCurrentActivity(id);
    if (status === 200 && data) {
      console.log(data[0].name);
      return data[0].name;
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
        setProjects((projects) => [...projects, response.data]);
        handleShow();
        setModalMessage("El proyecto ha sido creado correctamente.");
        //TODO checkear si funciona bien, falla en el back en bonita no ejecuta
        //Una vez que está creado el proyecto podemos correr la primera tarea
        await ProjectService.startActivity(response.data.id);
      } else {
        console.log("Error al crear el proyecto");
      }
    } catch (e) {
      console.log("Error al crear el proyecto");
    }
  };

  const handleSubmitApprove = async (event) => {
    event.preventDefault();
    setShowApprove(false);
    const { data } = await ProjectService.getCurrentActivity(proyectIdRegister);
    if (data[0].displayName === "Registrar resultado") {
      await ProjectService.assignActivity(
        proyectIdRegister,
        localStorage.getItem("userId")
      );
      await ProjectService.startActivity(proyectIdRegister);
      setModalMessage("El protocolo ha sido aprobado correctamente.");
      handleShow();
    } else {
      setModalMessage(
        "Para poder aprobar un proyecto deben ejecutarse todos los protocolos asociados."
      );
      handleShow();
    }
  };

  const handleShowProtocols = async () => {};

  const startProject = async (projectId) => {
    const { data } = await ProjectService.getProtocolsByProject(projectId);
    if (data.protocol.length === 0) {
      setModalMessage(
        "Para poder iniciar un proyecto debe agregarse al menos un protocolo."
      );
      handleShow();
    } else {
      /*TODO deshabilitar el botón de iniciar proyecto funciona una vez, 
      pero si vamos a los protocolos y volvemos se vuelve a habilitar, 
      y en ese caso se podría correr otra tarea desde ahí, habría que guardar 
      algo en la bd para consultar si ya no fue iniciado podría ser el startDate?*/
      //setDisabledButton(true);//arreglar porque diseablea todo
      
      await ProjectService.assignActivity(projectId, localStorage.getItem("userId")); 
      await ProjectService.startActivity(projectId);      
      handleShow();
      setModalMessage("El proyecto ha sido inicializado correctamente.");

    }
  };

  const formatDate = (date) => {
    return date.split(" ")[0].split("-").reverse().join("-");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseApprove = () => setShowApprove(false);
  const handleShowApprove = (projectId) => {
    setShowApprove(true);
    setProyectIdRegister(projectId);
  };

  return (
    <>
      <Navbar />

      <Modal show={showApprove} onHide={handleCloseApprove}>
        <Modal.Header closeButton>
          <Modal.Title>Aprobar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group size="lg" controlId="proyectId">
            <Form.Label>Id de proyecto: {proyectIdRegister}</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseApprove}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmitApprove}>
            Aprobar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Proyectos</Modal.Title>
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

        <div className="mt-5">
          <h3>Proyectos listos para verificar</h3>
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha de creación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map((project) => (
                  <tr>
                    <td>{project.id}</td>
                    <td>{formatDate(project.start)}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowApprove(project.id)}
                      >
                        Registrar resultado
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
