import React, { useState } from "react";
import toast from "react-hot-toast";
import Auth from "@aws-amplify/auth";

const Login = ({ setAuthenticated, getLinks }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await Auth.signIn(email, password)
        .then(() => {
          getLinks();
          setAuthenticated(true);
        })
        .catch((e) => {
          console.log(e);
          if (e.code === "NotAuthorizedException") toast.error(e.message);
        });
    } else {
      toast.error("Please enter your email and password.");
    }
  };

  const validate = () => {
    let response = false;
    if (email !== "" && password !== "") response = true;
    return response;
  };

  return (
    <div className="container container-fluid">
      <div className="row">
        <div className="col-col-md-4 offset-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <button className="btn btn-primary float-right" onClick={(e) => onSubmit(e)}>
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
