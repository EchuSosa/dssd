import React, { useState, useEffect } from "react";
import { FaEye, FaPowerOff, FaPlusCircle, FaRedoAlt, FaPlayCircle,FaCheckSquare, FaCheck } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import { Form, Button, Table, Modal } from "react-bootstrap";
import ProjectService from "../service/project-service";
import "./Chief.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function ChiefOfProject() {
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
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
        getProjects()
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
    const  data  = await ProjectService.approveProject(proyectIdRegister,localStorage.getItem("userId"));
    if (data) {            
      setModalMessage("El proyecto ha sido aprobado correctamente.");
      handleShow();
    } else {
      setModalMessage(
        "Para poder aprobar un proyecto deben ejecutarse todos los protocolos asociados."
      );
      handleShow();
    }
  };

  const handleSubmitRestart = async (event) => {
    event.preventDefault();
    setShowRestart(false);
    const  data  = await ProjectService.restartProject(proyectIdRegister,localStorage.getItem("userId"));
    if (data) {      
      setModalMessage("El proyecto ha sido reiniciado correctamente.");
      handleShow();
    } else {
      setModalMessage(
        "Para poder reiniciar un proyecto deben ejecutarse todos los protocolos asociados."
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
  const handleCloseRestart = () => setShowRestart(false);

  const handleShowApprove = (projectId) => {
    setShowApprove(true);
    setProyectIdRegister(projectId);
  };
  const handleShowRestart = (projectId) => {
    setShowRestart(true);
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
      <Modal show={showRestart} onHide={handleCloseRestart}>
        <Modal.Header closeButton>
          <Modal.Title>Reiniciar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group size="lg" controlId="proyectId">
            <Form.Label>Id de proyecto: {proyectIdRegister}</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRestart}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmitRestart}>
            Reiniciar
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
          <h3>Proyectos activos</h3>

          { projects.length > 0 ? 
                    <Table striped bordered hover size="lg">
                    <thead>
                      <tr>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >ID</th>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >Nombre</th>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >Estado</th>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >Fecha de creación</th>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >Protocolos</th>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >Accion</th>
                      <th style={{"text-align": "center","vertical-align":"middle"}} >Cancelar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.length > 0 &&
                        projects.map((project) => (
                          <tr>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>{project.id}</td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>{project.name}</td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>
                              {project.currentState === "iniciado" ||
                              project.currentState == null
                                ? "Configurar"
                                : "Ejecutando"}
                            </td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>{formatDate(project.start)}</td>
                            <td style={{"text-align": "left","vertical-align":"middle"}}>
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
                                <FaPlusCircle color="white" size={20} />  Cargar 
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
                                  <FaEye color="white" size={20} /> Revisar 
                                </Button>
                              )}
                            </td>
        
                            <td style={{"text-align": "left","vertical-align":"middle"}}>
                              {project.currentState === "iniciado" ||
                              project.currentState == null ? (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => startProject(project.id)}
                                  disabled={disabledButton}
                                >
                                <FaPlayCircle color="white" size={20} />  Finalizar Configuracion
                                </Button>
                              ) : (
                                <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleShowRestart(project.id)}
                              >
                              <FaRedoAlt color="white" size={20} />  Reiniciar proyecto
                              </Button>
                              )}
                            </td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => deleteProject(project.id)}
                                disabled={disabledButton}
                              >
                                <FaPowerOff color="white" size={20} /> 
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
          : "Actualmente no se esta ejecutando ningun proyecto" }

        </div>

        <div className="mt-5">
          <h3>Proyectos esperando aprobación</h3>

          {projects.length > 0 &&  projects.filter(function (project) {
                    return project.currentDecision == "ultimo";
                  }).length > 0 ? <Table striped bordered hover size="lg">
                  <thead>
                    <tr>
                    <th style={{"text-align": "center","vertical-align":"middle"}} >ID</th>
                    <th style={{"text-align": "center","vertical-align":"middle"}} >Nombre</th>
                    <th style={{"text-align": "center","vertical-align":"middle"}} >Fecha de creación</th>
                    <th style={{"text-align": "center","vertical-align":"middle"}} >Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length > 0 &&
                      projects
                        .filter(function (project) {
                          return project.currentDecision == "ultimo";
                        })
                        .map((project) => (
                          <tr>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>{project.id}</td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>{project.name}</td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>{formatDate(project.start)}</td>
                            <td style={{"text-align": "center","vertical-align":"middle"}}>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleShowApprove(project.id)}
                              >
                              <FaCheck color="white" size={20} />  Aprobar proyecto
                              </Button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </Table> : "No hay proyectos esperando aprobacion" }
          
        </div>
      </div>
      <Footer />
    </>
  );
}
