/*global chrome*/
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import Auth from "@aws-amplify/auth";
import LoadingIcon from "./components/LoadingIcon";
import Login from "./components/Login";
import apiGatewayCall from "./helpers/apiGatewayCall";

function App() {
  useEffect(() => {
    const getCurrentSession = async () => {
      await Auth.currentSession()
        .then(() => {
          getLinks();
          getCurrentTab();
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
  const [lists, setLists] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  // const [title, setTitle] = useState(() => {
  //   let _title = "";
  //   if (parsedUrl.searchParams.get("title") !== null) _title = parsedUrl.searchParams.get("title");
  //   return _title;
  // });

  // const [url, setUrl] = useState(() => {
  //   let _url = "";
  //   if (parsedUrl.searchParams.get("text") !== null) _url = parsedUrl.searchParams.get("text");
  //   return _url;
  // });

  const getLinks = async () => {
    setLoading(true);
    await apiGatewayCall("links", "get")
      .then((data) => {
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
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const onLogoutClick = async () => {
    await Auth.signOut()
      .then(() => {
        toast.success("You have successfully signed out.");
        setAuthenticated(false);
      })
      .catch((e) => console.log(e));
  };

  const getCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTitle(tabs[0].title);
      setUrl(tabs[0].url);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiGatewayCall("links", "post", { body: { url: url, title: title } })
      .then(() => {
        setLoading(false);
        window.close();
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <>
      {loading && <LoadingIcon />}
      <Toaster />

      {authenticated ? (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col col-md-4 offset-md-4">
                <h1>Save link</h1>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className="form-group">
                    <label htmlFor="url">URL</label>
                    <input
                      className="form-control"
                      type="url"
                      onChange={(e) => setUrl(e.target.value)}
                      id="url"
                      value={url}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <textarea
                      name="title"
                      id="title"
                      rows="5"
                      className="form-control"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary float-right">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Login setAuthenticated={setAuthenticated} getLinks={getLinks} />
        </>
      )}
    </>
  );
}

export default App;
