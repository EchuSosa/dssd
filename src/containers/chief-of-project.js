import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Card, Col, Row } from "react-bootstrap";

import createProject from "../service/create-project";
import "./Chief.css";

export default function ChiefOfProject() {
  const [id, setId] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const history = useHistory();

  const validateForm = () => {
    return name.length > 0 && description.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProjects((projects) => [...projects, name]);
    const { data } = await createProject(name, description);
    if (data && data.response) {
      console.log(data);
      setId(data.response)
    } else {
      console.log("Error al crear un proyecto");
    }
  };

  const handleShowProtocols = async (event) => {
    history.push(`/projects/${id}/protocols`);
  };

  const handleStartProject = async (event) => {
    console.log("Agregar logica de iniciar un proyecto");
  };

  return (
    <>
    <div class="chief-body">
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
        <Form.Group controlId="description">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setDescription(e.target.value)}
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
    </>
  );
}
