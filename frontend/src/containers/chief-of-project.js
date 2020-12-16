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
    const { data, status } = await ProjectService.getAllByUser(
      localStorage.getItem("userId")
    );
    if (status === 200 && data) {
      setProjects(data.response);
    }
  };

  const deleteProject = async (idProject) => {
    const { status } = await ProjectService.deleteProject(idProject);
    if (status === 200) {
      setProjects(projects.filter((project) => project.id !== idProject));
      handleShow();
      setModalMessage("El proyecto ha sido eliminado correctamente.");
    } else {
      handleShow();
      setModalMessage("Hubo un error al querer eliminar el proyecto");
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const { status, data } = await ProjectService.createProject(
        name,
        endDate
      );
      event.target.reset();
      if (status === 200 && data) {
        setProjects((projects) => [...projects, data]);
        handleShow();
        setModalMessage("El proyecto ha sido creado correctamente.");
        //TODO checkear si funciona bien, falla en el back en bonita no ejecuta
        //Una vez que está creado el proyecto podemos correr la primera tarea
        await ProjectService.startActivity(data.id);
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
        "Para poder finalizar la configuración de un proyecto debe agregarse al menos un protocolo."
      );
      handleShow();
    } else {
      await ProjectService.assignActivity(
        projectId,
        localStorage.getItem("userId")
      );
      await ProjectService.startActivity(
        projectId,
        localStorage.getItem("userId")
      );
      await ProjectService.updateProject(projectId);
      handleShow();
      setModalMessage(
        "Se ha finalizado la configuración del proyecto correctamente."
      );
      const getAllProjects = await ProjectService.getAllByUser(
        localStorage.getItem("userId")
      );
      if (getAllProjects.status === 200 && getAllProjects.data) {
        setProjects(getAllProjects.data.response);
      }
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
            Cerrar
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
                <th>Protocolos</th>
                <th>Accion</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map((project) => (
                  <tr>
                    <td>{project.id}</td>
                    <td>
                      {project.currentState === "iniciado" ||
                      project.currentState == null
                        ? "Configurar protocolos"
                        : "Ejecutando"}
                    </td>
                    <td>{formatDate(project.start)}</td>
                    <td>
                      {project.currentState === "iniciado" ||
                      project.currentState == null ? (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => {
                            handleShowProtocols();
                            history.push(`/projects/${project.id}/protocols`);
                          }}
                        >
                          Cargar Protocolos
                        </Button>
                      ) : (
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={() => {
                            handleShowProtocols();
                            history.push(`/projects/${project.id}/protocols`);
                          }}
                        >
                          Revisar protocolos
                        </Button>
                      )}
                    </td>

                    <td>
                      {project.currentState === "iniciado" ||
                      project.currentState == null ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => startProject(project.id)}
                          disabled={disabledButton}
                        >
                          Finalizar Configuracion
                        </Button>
                      ) : (
                        "Proyecto iniciado"
                      )}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        disabled={disabledButton}
                      >
                        Cancelar proyecto
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
                projects
                  .filter(function (project) {
                    return project.currentState == "esperando aprobacion";
                  })
                  .map((project) => (
                    <tr>
                      <td>{project.id}</td>
                      <td>{formatDate(project.start)}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleShowApprove(project.id)}
                        >
                          Aprobar proyecto
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
