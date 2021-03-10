import React, { useEffect, useState } from "react";
import config from "../config";

const Home = () => {
  const [activeLinks, setActiveLinks] = useState(null);
  const [archivedLinks, setArchivedLinks] = useState(null);
  // const [links, setLinks] = useState(null);
  useEffect(() => {
    getLinks();
  }, []);

  const getLinks = async () => {
    await fetch(config.apiRoot + "links")
      .then((response) => response.json())
      .then((data) => {
        setActiveLinks(data.active);
        setArchivedLinks(data.archived);
        // setLinks(data);
      })
      .catch((e) => console.log(e));
  };
  const onDelete = async (e, id) => {
    e.preventDefault();
    await fetch(config.apiRoot + "links/" + id, { method: "DELETE" })
      .then(async () => await getLinks())
      .catch((e) => console.log(e));
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h1>Saved links</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {activeLinks ? (
            activeLinks.length > 0 ? (
              <table className="table">
                <tbody>
                  {activeLinks.map((link) => (
                    <tr key={link.uuid}>
                      <td>
                        <a href={link.url} target="_blank" rel="noreferrer">
                          {link.title}
                        </a>
                      </td>
                      <td className="text-right">
                        <button onClick={(e) => onDelete(e, link.uuid)} className="btn btn-danger">X</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nothing found</p>
            )
          ) : (
            <p>Loading...</p>
          )}
          {archivedLinks && archivedLinks.length > 0 && (
            <>
              <h2>Archived links</h2>
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    {archivedLinks.map((link) => (
                      <tr key={link.uuid}>
                        <td>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.title}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
