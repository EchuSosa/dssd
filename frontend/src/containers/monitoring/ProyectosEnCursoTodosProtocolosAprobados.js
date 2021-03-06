import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ProjectService from "../../service/project-service";
import Navbar from "../../components/navbar";
import "../Project.css";

export default function ProyectosEnCursoTodosProtocolosAprobados() {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    const { data } = await ProjectService.getProjects();
    const ejecutedProjects = data.filter(
      (element) => element.status === "ejecutando"
    );
    if (ejecutedProjects && ejecutedProjects.length > 0) {
      ejecutedProjects.forEach(async (element) => {
        let { data } = await ProjectService.getProtocolsByProject(
          element.bonitaIdProject
        );
        let approved = data.protocol.filter((protocol) => protocol.score >= 5);
        if (
          data.protocol.length > 0 &&
          approved.length === data.protocol.length
        ) {
          setProjects((projects) => [
            ...projects,
            {
              id: element.id,
              caseId: element.bonitaIdProject,
              name: element.name,
              status: element.status,
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
          <h3>
            Proyectos que se encuentran en curso y con todos sus protocolos
            aprobados
          </h3>
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
              <th>Estado</th>
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
                  <td>{project.status}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
