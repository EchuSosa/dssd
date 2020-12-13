import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import getAll from "../service/user-service";

import "./Project.css";

export default function Users() {

  const history = useHistory();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {

    const { data } = await getAll();
    setUsers(data)
    // return projects
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
    <div className="user-list">
      <div className="header">
        <h3>Listado de usuarios</h3>
        
      </div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 && users.map(
            user => (
              <tr>
                <td>{user.id}</td>
                <td>{user.userName}</td>
              </tr>
            )
          )}  
        </tbody>
      </Table>      
    </div>
    </>
  );
};

