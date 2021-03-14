import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import LoadingIcon from "./components/LoadingIcon";
import Login from "./components/Login";
import Add from "./pages/Add";
import Home from "./pages/Home";
import toast, { Toaster } from "react-hot-toast";
import Auth from "@aws-amplify/auth";

function App() {
  useEffect(() => {
    const getCurrentSession = async () => {
      await Auth.currentSession()
        .then(() => {
          setAuthenticated(true);
          // setSyncing(false);
        })
        .catch((e) => {
          // setSyncing(false);
          console.log(e);
        });
    };
    // setSyncing(true);
    getCurrentSession();
    // eslint-disable-next-line
  }, []);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const onLogoutClick = async (e) => {
    e.preventDefault();
    await Auth.signOut()
      .then(() => {
        toast.success("You have successfully signed out.");
        setAuthenticated(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Router>
      {loading && <LoadingIcon />}
      <Toaster />
      <Header authenticated={authenticated} />
      {authenticated ? (
        <Switch>
          <Route exact path="/">
            <Home setLoading={setLoading} onLogoutClick={onLogoutClick} />
          </Route>
          <Route exact path="/add">
            <Add setLoading={setLoading} />
          </Route>
        </Switch>
      ) : (
        <Login setAuthenticated={setAuthenticated} />
      )}
    </Router>
  );
}

export default App;
