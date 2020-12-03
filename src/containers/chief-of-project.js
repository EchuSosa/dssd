import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Card, Col, Row } from "react-bootstrap";

import createProject from "../service/create-project";
import "./Chief.css";

export default function ChiefOfProject() {
  const [id, setId] = useState(1);
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const history = useHistory();

  const validateForm = () => {
    return name.length > 0 && endDate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //TODO
    //Recuperemos los proyectos desde la bd
    //remover el setProjects de esta linea una vez que recuperemos los datos desde la bd
    setProjects((projects) => [...projects, name]);

    const { data } = await createProject(name, endDate);
    if (data && data.response) {
      setId(data.response);
      //TODO
      //Ver respuesta y actualizar el listado de proyectos con el nuevo proyecto
    } else {
      console.log("Error al crear un proyecto");
    }
  };

  const handleShowProtocols = async () => {
    history.push(`/protocols/${id}`);
  };

  const handleStartProject = async () => {
    //TODO
    //Pegarle al back para actualizar la fecha de startDate del proyecto
    //Cambiar el estado de la tarea de bonita para que quede finalizada,
    //Luego de esto se tiene que ver las tareas que le siguen
  };

  /*
  //TODO
  Descomentar esto cuando se pueda pegar al back para devolver los proyectos creados
  const fetchData = async () => {
    try {
      const response = await getAllProjects();
      setProjects(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
*/

  return (
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
      <div class="project-list">
        <Card>
          <Card.Header>Proyectos</Card.Header>
          {projects.length === 0 && (
            <Card.Body>
              <Card.Title>No hay proyectos creados</Card.Title>
            </Card.Body>
          )}
          {projects.length > 0 &&
            projects.map((project) => (
              <Card.Body>
                <Row>
                  <Col xs={8}>
                    <Card.Title>Nombre: {project}</Card.Title>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={handleShowProtocols}
                    >
                      Ver Protocolos
                    </Button>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleStartProject}
                    >
                      Iniciar Proyecto
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            ))}
        </Card>
      </div>
    </div>
  );
}
