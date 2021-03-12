import React, { useState } from "react";
import apiGatewayCall from "../helpers/apiGatewayCall";

const Add = ({ setLoading }) => {
  const parsedUrl = new URL(window.location.toString());

  const [title, setTitle] = useState(() => {
    let _title = "";
    if (parsedUrl.searchParams.get("title") !== null) _title = parsedUrl.searchParams.get("title");
    return _title;
  });

  const [url, setUrl] = useState(() => {
    let _url = "";
    if (parsedUrl.searchParams.get("text") !== null) _url = parsedUrl.searchParams.get("text");
    return _url;
  });

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
  );
};

export default Add;
