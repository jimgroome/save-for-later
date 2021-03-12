import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { MDBBtn, MDBModalBody, MDBModalFooter } from "mdbreact";
import toast from "react-hot-toast";

const Register = ({ setRegisterModalOpen, onRegisterComplete }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await Auth.signUp({ username, password })
        .then((user) => onRegisterComplete(user))
        .catch((e) => {
          if (e.code === "InvalidParameterException")
            toast.error("Make sure your password is at least six characters long.");
          console.log(e);
        });
    } else {
      toast.error("Please enter your email and a password, and make sure the passwords match.");
    }
  };
  const validate = () => {
    let response = false;
    if (username !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) response = true;
    return response;
  };
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <MDBModalBody>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <p>
            <small>Password must be at least six characters long.</small>
          </p>
          <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn
          color="secondary"
          onClick={(e) => {
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setRegisterModalOpen(false);
          }}
        >
          Cancel
        </MDBBtn>
        <MDBBtn color="primary" onClick={(e) => onSubmit(e)} type="submit">
          Sign up
        </MDBBtn>
      </MDBModalFooter>
    </form>
  );
};

export default Register;
