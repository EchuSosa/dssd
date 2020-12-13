import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import getAll from "../service/monitoring-service";

import "./Project.css";

export default function Monitoring() {

  const history = useHistory();
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {

    const { data } = await getAll();
    setProjects(data.projects)
    // return projects
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
    <div className="project-list">
      <div className="header">
        <h3>Listado de proyectos</h3>
        
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
          {projects.length > 0 && projects.map(
            project => (
              <tr>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.user_id}</td>
              </tr>
            )
          )}  
        </tbody>
      </Table>      
    </div>
    </>
  );
};

