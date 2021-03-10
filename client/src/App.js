import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Add from "./pages/Add";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top mb-4">
        <Link to="/" className="navbar-brand">
          Save for later
        </Link>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/add" className="nav-link">
              +
            </Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/add">
          <Add />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
