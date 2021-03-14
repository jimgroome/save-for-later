import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import LoadingIcon from "./components/LoadingIcon";
import Login from "./components/Login";
import Add from "./pages/Add";
import Home from "./pages/Home";
import toast, { Toaster } from "react-hot-toast";
import Auth from "@aws-amplify/auth";
import Settings from "./components/Settings";

function App() {
  useEffect(() => {
    const getCurrentSession = async () => {
      await Auth.currentSession()
        .then(() => {
          setAuthenticated(true);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getCurrentSession();
    // eslint-disable-next-line
  }, []);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const onLogoutClick = async (e) => {
    e.preventDefault();
    await Auth.signOut()
      .then(() => {
        toast.success("You have successfully signed out.");
        setSettingsModalOpen(false);
        setAuthenticated(false);
      })
      .catch((e) => console.log(e));
  };

  const onSettingsClick = () => {
    setSettingsModalOpen(true);
  };

  const onSettingsSave = () => {
    toast.success("Settings saved");
    setSettingsModalOpen(false);
  };

  return (
    <Router>
      {loading && <LoadingIcon />}
      <Toaster />

      {authenticated ? (
        <Switch>
          <Route exact path="/">
            <Header variant="home" onSettingsClick={onSettingsClick} />
            <Home setLoading={setLoading} />
            <Settings
              settingsModalOpen={settingsModalOpen}
              setSettingsModalOpen={setSettingsModalOpen}
              onSettingsSave={onSettingsSave}
              onLogoutClick={onLogoutClick}
            />
          </Route>
          <Route exact path="/add">
            <Header variant="add" />
            <Add setLoading={setLoading} />
          </Route>
        </Switch>
      ) : (
        <>
          <Header variant="logged-out" />
          <Login setAuthenticated={setAuthenticated} />
        </>
      )}
    </Router>
  );
}

export default App;
