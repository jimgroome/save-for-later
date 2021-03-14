import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import Auth from "@aws-amplify/auth";
import Header from "./components/Header";
import LoadingIcon from "./components/LoadingIcon";
import Login from "./components/Login";
import Add from "./pages/Add";
import Settings from "./components/Settings";
import ArchivedLinks from "./components/ArchivedLinks";
import Links from "./components/Links";
import apiGatewayCall from "./helpers/apiGatewayCall";

function App() {
  useEffect(() => {
    const getCurrentSession = async () => {
      await Auth.currentSession()
        .then(() => {
          getLinks();
          setAuthenticated(true);
        })
        .catch((e) => {
          if (e !== "No current user") console.log(e);
        });
    };
    getCurrentSession();
    // eslint-disable-next-line
  }, []);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [syncing, setSyncing] = useState(false);

  const [allActiveLinks, setAllActiveLinks] = useState(null);
  const [allArchivedLinks, setAllArchivedLinks] = useState(null);
  const [filteredActiveLinks, setFilteredActiveLinks] = useState(null);
  const [filteredArchivedLinks, setFilteredArchivedLinks] = useState(null);
  const [lists, setLists] = useState(null);

  const [currentList, setCurrentList] = useState({ uuid: "none", label: "None" });
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getLinks = async () => {
    setSyncing(true);
    await apiGatewayCall("links", "get")
      .then((data) => {
        setAllActiveLinks(data.active);
        setAllArchivedLinks(data.archived);
        setLists(() => {
          let _lists = [];
          _lists.push({ uuid: "none", label: "None" });
          data.lists.forEach((list) => {
            _lists.push({
              uuid: list.uuid,
              label: list.title,
            });
          });
          return _lists;
        });
        filterLinks(data.active, data.archived, currentList);
        setSyncing(false);
      })
      .catch((e) => {
        setSyncing(false);
        console.log(e);
      });
  };

  const filterLinks = (active, archived, list) => {
    console.log(list);
    setFilteredActiveLinks(() => {
      let _filteredActiveLinks = [];
      if (list.uuid !== "none") {
        active.forEach((link) => {
          if (link.listId === list.uuid) {
            _filteredActiveLinks.push(link);
          }
        });
      } else {
        active.forEach((link) => {
          if (link.listId === undefined) _filteredActiveLinks.push(link);
        });
      }
      console.log(_filteredActiveLinks);
      return _filteredActiveLinks;
    });
    setFilteredArchivedLinks(() => {
      let _filteredArchivedLinks = [];
      if (list.uuid !== "none") {
        archived.forEach((link) => {
          if (link.listId === list.uuid) {
            _filteredArchivedLinks.push(link);
          }
        });
      } else {
        archived.forEach((link) => {
          if (link.listId === undefined) _filteredArchivedLinks.push(link);
        });
      }
      console.log(_filteredArchivedLinks);
      return _filteredArchivedLinks;
    });
  };
  const onDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiGatewayCall(`links/${linkToDelete}`, "del")
      .then(async () => {
        setDeleteModalOpen(false);
        setLoading(false);
        await getLinks();
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  const onDeleteClick = (e, id) => {
    e.preventDefault();
    setDeleteModalOpen(true);
    setLinkToDelete(id);
  };
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const onLogoutClick = async () => {
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

  const onListSelectChange = async (newValue) => {
    console.log(newValue);
    lists.forEach((list) => {
      if (list.label === newValue.label) setCurrentList(list);
    });
    filterLinks(allActiveLinks, allArchivedLinks, newValue);
  };

  return (
    <Router>
      {loading && <LoadingIcon />}
      <Toaster />

      {authenticated ? (
        <Switch>
          <Route exact path="/">
            <Header variant="home" onSettingsClick={onSettingsClick} />
            <MDBContainer fluid>
              <MDBRow>
                <MDBCol>
                  <h1>
                    {currentList.uuid !== "none" ? currentList.label : "Saved links"}
                    <MDBBtn color="primary" onClick={() => getLinks()} className="float-right">
                      <MDBIcon icon="sync" spin={syncing} />
                    </MDBBtn>
                  </h1>
                  {lists && lists.length > 1 && (
                    <Select
                      options={lists}
                      onChange={(newValue) => {
                        onListSelectChange(newValue);
                      }}
                      className="my-4"
                      placeholder="Select a list"
                    />
                  )}
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  {filteredActiveLinks &&
                    (filteredActiveLinks.length > 0 ? (
                      <Links links={filteredActiveLinks} onDeleteClick={onDeleteClick} />
                    ) : (
                      <p>Nothing found</p>
                    ))}
                </MDBCol>
              </MDBRow>
              {filteredArchivedLinks && filteredArchivedLinks.length > 0 && (
                <ArchivedLinks links={filteredArchivedLinks} />
              )}
              <MDBModal toggle={toggleDeleteModal} isOpen={deleteModalOpen} fade={false}>
                <MDBModalHeader>Confirm archive</MDBModalHeader>
                <MDBModalBody>Archive this link?</MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setLinkToDelete(null);
                      toggleDeleteModal();
                    }}
                  >
                    Cancel
                  </MDBBtn>
                  <MDBBtn color="danger" onClick={(e) => onDelete(e)}>
                    OK
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModal>
            </MDBContainer>
            <Settings
              settingsModalOpen={settingsModalOpen}
              setSettingsModalOpen={setSettingsModalOpen}
              onSettingsSave={onSettingsSave}
              onLogoutClick={onLogoutClick}
              lists={lists}
              getLinks={getLinks}
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
          <Login setAuthenticated={setAuthenticated} getLinks={getLinks} />
        </>
      )}
    </Router>
  );
}

export default App;
