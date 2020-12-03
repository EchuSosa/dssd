import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import createProtocol from "../service/create-protocol";

import "./Protocol.css";

export default function Protocol({ id, protocols, setProtocols }) {
  const [name, setName] = useState("");
  const [responsible, setResponsible] = useState("");
  const [order, setOrder] = useState(0);
  const [isLocal, setIsLocal] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState([]);

  const validateForm = () => {
    return (
      name.length > 0 && order.length > 0 && startDate && endDate && responsible
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
<<<<<<< HEAD
    const { data } = await createProtocol(name, id, responsible, order);
    if (data && data.response) {
      console.log(data);
      setProtocols((protocols) => [...protocols, { nombre: name, responsable:responsible }]);
    } else {
      console.log("Error al crear un proyecto");
    }
    
=======
    //TODO
    //Recuperemos los protocolos desde la bd, crear un servicio para que le pegue al back
    //remover el setProsetProtocolsjects de esta linea una vez que recuperemos los datos desde la bd
    setProtocols((protocols) => [
      ...protocols,
      { nombre: name, responsable: responsible },
    ]);
>>>>>>> 212249b1c6c67dda5c2347bc9eef8bbef7917236
  };

  /*
  //TODO
  Descomentar esto cuando se pueda pegar a bonita para mostrar solo los usuarios creados
  Modificar en el form el input para que se cargue con los usuarios de bonita
  Crear los servicios getAllUsers y getAllProtocols si no estan creados
  const fetchData = async () => {
    try {
      const allUsers = await getAllUsers();
      const allProtocols = await getAllProtocols();
      setUsers(allUsers);
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
    <div class="protocol-body">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="projectId">
          <Form.Label>Identificador del proyecto:{id}</Form.Label>
        </Form.Group>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Nombre del Protocolo</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formGridState">
          <Form.Label>Responsable</Form.Label>
          <Form.Control as="select" defaultValue="Seleccionar...">
            <option>Camila Faraone</option>
            <option>Echu Sosa</option>
          </Form.Control>
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="isLocal">
              <Form.Check
                type="checkbox"
                label="Protocolo local"
                onChange={(e) => setIsLocal(e.target.checked)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group size="lg" controlId="order">
              <Form.Label>Orden del protocolo</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                min="0"
                onChange={(e) => setOrder(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group size="lg" controlId="startDate">
              <Form.Label>Fecha de incicio</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group size="lg" controlId="endDate">
              <Form.Label>Fecha de fin</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <div>
          <Button
            variant="dark"
            block
            size="lg"
            type="submit"
            disabled={!validateForm()}
          >
            Agregar
          </Button>
        </div>
      </Form>
    </div>
  );
}
