import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import MonitoringService from "../../service/monitoring-service";
import Navbar from "../../components/navbar";

import "../Project.css";

export default function ResponsablesProtocoloMasDesaprobaron() {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    const { data } = await MonitoringService.getAll();
    setProjects(data);
    // return projects
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <Navbar />
      <div className="project-list">
        <a href="/projects/monitoring">Volver al listado</a>
        <div className="header">
          <h3>Responsables de protocolos que más desaprobaron (FALTA)</h3>
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
            {projects.length > 0 &&
              projects.map((project) => (
                <tr>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.user_id}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
