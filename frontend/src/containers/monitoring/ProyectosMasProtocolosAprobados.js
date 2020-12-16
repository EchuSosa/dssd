import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ProjectService from "../../service/project-service";
import Navbar from "../../components/navbar";
import "../Project.css";

export default function ProyectosMasProtocolosAprobados() {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    const { data } = await ProjectService.getProjects();
    if (data && data.length > 0) {
      data.forEach(async (element) => {
        let { data } = await ProjectService.getProtocolsByProject(
          element.bonitaIdProject
        );
        let approved = data.protocol.filter((protocol) => protocol.score >= 5);
        if (approved.length > 0) {
          setProjects((projects) => [
            ...projects,
            {
              id: element.id,
              caseId: element.bonitaIdProject,
              name: element.name,
              cant: approved.length,
            },
          ]);
        }
      });
    } else {
      console.log("error");
    }
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
          <h3>Proyectos con mayor cantidad de protocolos aprobados</h3>
        </div>
        <p>
          Un protocolo se considera aprobado si su score es mayor o igual a 5
        </p>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Case Id</th>
              <th>Nombre</th>
              <th>Protocolos aprobados</th>
            </tr>
          </thead>
          <tbody>
            {projects &&
              projects.length > 0 &&
              projects.map((project) => (
                <tr>
                  <td>{project.id}</td>
                  <td>{project.caseId}</td>
                  <td>{project.name}</td>
                  <td>{project.cant}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
