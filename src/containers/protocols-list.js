import React, { useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Protocol from "./protocol";

// Datos para testear la tabla hay que borrarlos cuando consumamos de la bd
const dataTest = { id: "1", nombre: "Protocolo Test", responsable: "Camila" };

const ProtocolsList = (props) => {
  const [show, setShow] = useState(false);
  const [protocols, setProtocols] = useState([dataTest]);

  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Crea nuevo protocolo");
  };

  const goBack = () => {
    history.push("/projectconf");
  };

  /*
  //TODO
  Descomentar esto cuando se pueda pegar al back para recuperar los protocolos
  Tiene que estar creado el servicio getAllProtocols que le pegue al back si no esta creado
  const fetchData = async () => {
    try {
      const allProtocols = await getAllProtocols();
      setProtocols(allProtocols);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
*/

  return (
    <div class="protocol-list">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Protocolo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Protocol
            id={props.match.params.id}
            protocols={protocols}
            setProtocols={setProtocols}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <div class="header">
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
          </tr>
        </thead>
        <tbody>
          {protocols.length > 0 &&
            protocols.map((protocol) => (
              <tr>
                <td>{protocol.id}</td>
                <td>{protocol.nombre}</td>
                <td>{protocol.responsable}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div class="goBack">
        <Button variant="link" onClick={goBack}>
          Volver a los proyectos
        </Button>
      </div>
    </div>
  );
};

export default ProtocolsList;
