import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ProtocolService from "../../service/protocol-service";
import getAll from "../../service/user-service";
import Navbar from "../../components/navbar";
import "../Project.css";

export default function ResponsablesProtocoloMasDesaprobaron() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await getAll();
    setUsers(response.data);
  };

  const getUserName = (id) => {
    const user = users.filter((user) => user.id === id);
    return user[0].firstname + " " + user[0].lastname;
  };

  const getProjects = async () => {
    const { data } = await ProtocolService.getAll();
    if (data && data.length > 0) {
      const rejectedProtocols = data.filter(
        (element) => element.score !== null && element.score < 5
      );
      let cant = 1;
      const result = rejectedProtocols.reduce(function (r, a) {
        r[a.user_id] = r[a.user_id] || [];
        r[a.user_id] = cant++;
        return r;
      }, Object.create(null));
      let nuevo = [];
      for (const prop in result) {
        nuevo.push(`${prop} : ${result[prop]}`);
      }
      console.log(nuevo);
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    getUsers();
    getProjects();
  }, []);

  return (
    <>
      <Navbar />
      <div className="project-list">
        <a href="/projects/monitoring">Volver al listado</a>
        <div className="header">
          <h3>Responsables de protocolos que más desaprobaron</h3>
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
