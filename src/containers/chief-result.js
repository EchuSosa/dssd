import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { advanceTask } from "../service/processes-services";

export default function ChiefResult() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  //const [responsible, setResponsible] = useState("");
  //const [id, setId] = useState("");

  const validateForm = () => {
    return name.length > 0 && description.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //setProjects((projects) => [...projects, name]);
    const userId = localStorage.userId;
    console.log(userId);
    if (userId) {
      console.log("Llega");
      const { data } = await advanceTask(userId);
      //console.log(data);
    }
    //console.log(data);
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <h3>Crear un nuevo Proyecto</h3>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Nombre del Proyecto</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="description">
          <Form.Label>Descripción del Proyecto</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <div>
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Guardar
          </Button>
        </div>
        {projects.length > 0 && <h4>Proyectos creados</h4>}
        {projects.map((project) => (
          <p>{project}</p>
        ))}
      </Form>
    </div>
  );
}
