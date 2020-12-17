import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ProtocolService from "../../service/protocol-service";
import getAll from "../../service/user-service";
import Navbar from "../../components/navbar";
import "../Project.css";

export default function ResponsablesProtocoloMasDesaprobaron() {
  const [responsibles, setResponsibles] = useState([]);
  const [users, setUsers] = useState([]);

  const usuarios = (id) => {
    const allUsers = {
      1: "Echu Sosa",
      2: "Cami Faraone",
      3: "Fran Bellino",
    };
    return allUsers[id];
  };

  const getUsers = async (event) => {
    const { data, status } = await getAll();
    if (data && status === 200) {
      setUsers((users) => [...users, data]);
    } else {
      console.log("Error al traer usuarios");
    }
  };

  /*
  const getUserName = (id) => {
    const user = users.map((user) => {
      if (user.id === id) {
        return user.firstname + "" + user.lastname;
      } else {
        console.log("Error");
      }
    });
    console.log(user);
    if (user.length > 0) {
      return user[0].firstname + " " + user[0].lastname;
    } else console.log("Error user");
  };
*/

  const getProjects = async () => {
    const { data } = await ProtocolService.getAll();
    if (data && data.length > 0) {
      const rejectedProtocols = data.filter(
        (element) => element.score !== null && element.score < 5
      );
      const result = rejectedProtocols.reduce(function (r, a) {
        //r[a.user_id] = r[a.user_id] || [];
        //r[a.user_id].push(a);
        r[a.user_id] = (r[a.user_id] || 0) + +1;
        return r;
      }, Object.create(null));

      //Object.entries(result).map(([key, value]) => console.log(key, value));

      for (const key in result) {
        setResponsibles((responsibles) => [
          ...responsibles,
          {
            id: key,
            name: usuarios(key),
            value: result[key],
          },
        ]);
      }
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
              <th>Nombre</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {responsibles &&
              responsibles.length > 0 &&
              responsibles.map((responsible) => (
                <tr>
                  <td>{responsible.id}</td>
                  <td>{responsible.name}</td>
                  <td>{responsible.value}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
