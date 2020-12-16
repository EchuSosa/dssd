import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import ChiefOfProject from "./containers/chief-of-project";
import ResponsibleOfProtocol from "./containers/responsible-of-protocol";
import ChiefResult from "./containers/chief-result";
import ListOfProtocols from "./containers/protocols-list";
import Monitoring from "./containers/monitoring";
import ProyectosMasProtocolosAprobados from "./containers/monitoring/ProyectosMasProtocolosAprobados";
import ProyectosEnCursoTodosProtocolosAprobados from "./containers/monitoring/ProyectosEnCursoTodosProtocolosAprobados";
import ResponsablesProtocoloMasDesaprobaron from "./containers/monitoring/ResponsablesProtocoloMasDesaprobaron";
import ProyectosEnCursoConProtocolosAtrasados from "./containers/monitoring/ProyectosEnCursoConProtocolosAtrasados";
import Users from "./containers/users-list";

import NotFoundPage from "./containers/not-found";

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/users" component={Users} />
            <Route path="/projectconf" component={ChiefOfProject} />
            <Route path="/protocolexec" component={ResponsibleOfProtocol} />
            <Route path="/projects/monitoring" exact component={Monitoring} />
            <Route
              path="/projects/monitoring/query1"
              component={ProyectosMasProtocolosAprobados}
              exact
            />
            <Route
              path="/projects/monitoring/query2"
              component={ProyectosEnCursoTodosProtocolosAprobados}
              exact
            />
            <Route
              path="/projects/monitoring/query3"
              component={ResponsablesProtocoloMasDesaprobaron}
              exact
            />
            <Route
              path="/projects/monitoring/query4"
              component={ProyectosEnCursoConProtocolosAtrasados}
              exact
            />
            <Route path="/result" component={ChiefResult} />
            <Route path="/projects/:id/protocols" component={ListOfProtocols} />
            <Route path="/*" component={NotFoundPage} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
