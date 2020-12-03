import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./containers/Login";
import ChiefOfProject from "./containers/chief-of-project";
import ResponsibleOfProtocol from "./containers/responsible-of-protocol";
import ChiefResult from "./containers/chief-result";
import ListOfProtocols from "./containers/protocols-list";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/projectconf" component={ChiefOfProject} />
          <Route path="/protocolexec" component={ResponsibleOfProtocol} />
          <Route path="/result" component={ChiefResult} />
          <Route path="/protocols/:id" component={ListOfProtocols} />
        </Switch>
      </Router>
    );
  }
}

export default App;
