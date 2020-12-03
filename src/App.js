import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import ChiefOfProject from "./containers/chief-of-project";
import ResponsibleOfProtocol from "./containers/responsible-of-protocol";
import ChiefResult from "./containers/chief-result";
import ListOfProtocols from "./containers/protocols-list";
<<<<<<< HEAD
import Monitoring from "./containers/Monitoring";
=======
import NotFoundPage from "./containers/not-found";
>>>>>>> 212249b1c6c67dda5c2347bc9eef8bbef7917236

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
<<<<<<< HEAD
          <Route path="/projects/:id/protocols" component={ListOfProtocols} />
=======
          <Route path="/protocols/:id" component={ListOfProtocols} />
          <Route path="/*" component={NotFoundPage} />
>>>>>>> 212249b1c6c67dda5c2347bc9eef8bbef7917236
        </Switch>
      </Router>
    );
  }
}

export default App;
