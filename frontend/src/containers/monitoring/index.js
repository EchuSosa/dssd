import React from "react";
import Navbar from "../../components/navbar";

import "../Project.css";

export default function Monitoring() {
  return (
    <>
      <Navbar />
      <div className="project-list">
        <h1>Monitoreo</h1>
        <a href="/projects/monitoring/query1">
          Proyectos con mayor cantidad de protocolos aprobados
        </a>
        <a href="/projects/monitoring/query2">
          Proyectos que se encuentran en curso y con todos sus protocolos
          aprobados
        </a>
        <a href="/projects/monitoring/query3">
          Responsables de protocolos que más desaprobaron
        </a>
        <a href="/projects/monitoring/query4">
          Proyectos que se encuentran en curso y con protocolos atrasados
          (FALTA)
        </a>
      </div>
    </>
  );
}
