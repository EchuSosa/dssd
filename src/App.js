import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import ChiefOfProject from "./containers/chief-of-project";
import ResponsibleOfProtocol from "./containers/responsible-of-protocol";
import ChiefResult from "./containers/chief-result";
import ListOfProtocols from "./containers/protocols-list";
import Monitoring from "./containers/Monitoring";
import NotFoundPage from "./containers/not-found";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/projectconf" component={ChiefOfProject} />
          <Route path="/protocolexec" component={ResponsibleOfProtocol} />
          <Route path="/projects/monitoring" component={Monitoring} />
          <Route path="/result" component={ChiefResult} />
          <Route path="/projects/:id/protocols" component={ListOfProtocols} />
          <Route path="/*" component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
