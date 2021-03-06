import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import ProtocolService from "../service/protocol-service";
import { FaTrashAlt, FaRedo } from 'react-icons/fa';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Protocol from "./protocol";
import ProjectService from "../service/project-service";
import getAll from "../service/user-service";

const ProtocolsList = (props) => {
  const [show, setShow] = useState(false);
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [protocols, setProtocols] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [users, setUsers] = useState([]);

  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseModalMessage = () => setShowModalMessage(false);
  const handleShowModalMessage = () => setShowModalMessage(true);

  const goBack = () => {
    history.push("/projectconf");
  };

  const restartProtocol = async (idProtocol) => {
    const userId = localStorage.getItem("userId");
    const response = await ProtocolService.restart(idProtocol, userId);
    fetchData();
    handleShowModalMessage();
    setModalMessage("El protocolo ha sido reiniciado.");
  };

  const fetchData = async () => {
    const { data } = await ProtocolService.getAllByProjectId(
      props.match.params.id
    );
    setProtocols(data.protocol);
    const currentProject = await ProjectService.getProjectByBonitaId(
      props.match.params.id
    );
    if (
      currentProject &&
      currentProject.status === 200 &&
      currentProject.data
    ) {
      setProjectStatus(currentProject.data.status);
    } else console.log("No existe un proyecto con ese id de bonita en la bd");
  };

  const getUsers = async (event) => {
    const { data, status } = await getAll();
    if (data && status === 200) {
      setUsers(data);
    } else {
      console.log("Error al traer usuarios");
    }
  };

  const getResponsibleName = (userId) => {
    const userResponsible = users.filter((user) => user.id === userId);
    if (userResponsible.length !== 0) {
      const firstname = userResponsible[0].firstname;
      const lastname = userResponsible[0].lastname;
      return `${firstname} ${lastname}`;
    } else {
      return "Responsable remoto";
    }
  };

  useEffect(() => {
    fetchData();
    getUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="protocol-list">
        <Modal show={showModalMessage} onHide={handleCloseModalMessage}>
          <Modal.Header closeButton>
            <Modal.Title>Protocolos</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalMessage}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

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
              users={users}
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
          {projectStatus === "iniciado" && (
            <Button variant="success" onClick={handleShow}>
              + Agregar Protocolo
            </Button>
          )}
        </div>
        { protocols.length > 0 ? <Table striped bordered hover size="sm">
          <thead>
            <tr>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Id</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Nombre</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Responsable</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Orden</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Lugar de ejeccucion</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Puntaje</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Reiniciar</th>
            <th style={{"text-align": "center","vertical-align":"middle"}} >Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {protocols.length > 0 &&
              protocols.map((protocol) => (
                <tr>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.id}</td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.name}</td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>{getResponsibleName(protocol.user_id)}</td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.order}</td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>{protocol.isLocal == 1 ? "Local" : "Remoto"}</td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>
                    {protocol.score == null ? "Sin puntaje" : protocol.score}
                  </td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>
                    {protocol.score !== null ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => restartProtocol(protocol.id)}
                      >
                        <FaRedo color="white" size={20} />
                      </Button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td style={{"text-align": "center","vertical-align":"middle"}}>
                  <Button
                        variant="danger"
                        size="sm"
                        onClick={() => restartProtocol(protocol.id)}
                      >
                        <FaTrashAlt color="white" size={20} />
                      </Button>
                  
                  </td>
                </tr>
              ))}
          </tbody>
        </Table> : "Aun no se cargaron protocolos"}
        
        <div className="goBack">
          <Button variant="link" onClick={goBack}>
            Volver a los proyectos
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProtocolsList;
