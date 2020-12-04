import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Card, Col, Row,Table, Modal } from "react-bootstrap";

import createProject from "../service/create-project";
import getAll from "../service/project-service";
import "./Chief.css";

export default function ChiefOfProject() {
  const [id, setId] = useState(null);
  const [uid, setUid] = useState("");
  const [name, setName] = useState(""); 
  const [endDate, setEndDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const history = useHistory();

  const validateForm = () => {
    return name.length > 0 && endDate;
  };

  const getProjects = async () => {
    setUid(localStorage.getItem("userId"))
    const { data } = await getAll(localStorage.getItem("userId"));
    console.log(data.response)
    if (data){
      setProjects(data.response)
    } 
    
  }

  useEffect(() => {
    getProjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    createProject(name, endDate, uid);

  };

  const handleShowProtocols = async () => {
    
  };

  const handleStartProject = async (event) => {
    console.log("Agregar logica de iniciar un proyecto");
    
  };

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
      <div className="project-list p-1">
      <Table striped bordered hover size="lg">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Acción</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 &&
                  projects.map((project) => (
                    <tr>
                      <td>{project.id}</td>
                      <td>{project.state}</td>
                      <td> 
                        <Button
                      variant="dark"
                      size="sm"
                      //onClick={handleShowProtocols}
                      onClick={() => { handleShowProtocols(); history.push(`/projects/${project.id}/protocols`); }
                      }        
                      >
                      Ver Protocolos
                    </Button>
                    </td>
                    <td> 
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleStartProject}
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
  );
}
