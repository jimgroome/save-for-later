import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBModal, MDBModalHeader, MDBRow } from "mdbreact";
import React, { useState } from "react";
import Register from "./Register";
import toast from "react-hot-toast";
import ConfirmRegister from "./ConfirmRegister";
import Auth from "@aws-amplify/auth";

const Login = ({ setAuthenticated, getLinks }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [newUser, setNewUser] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await Auth.signIn(email, password)
        .then(() => {
          getLinks()
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

  const onRegisterClick = (e) => {
    setEmail("");
    setPassword("");
    setRegisterModalOpen(true);
  };

  const onRegisterComplete = (user) => {
    setRegisterModalOpen(false);
    setConfirmModalOpen(true);
    console.log(user);
    setNewUser(user);
  };

  const onConfirmComplete = () => {
    toast.success("Thanks for registering! You can now sign in.");
    setConfirmModalOpen(false);
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol md="4" className="offset-md-4">
          <MDBCard className="mb-4">
            <MDBCardBody>
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
                <MDBBtn type="submit" onClick={(e) => onSubmit(e)} color="primary" className="float-right">
                  Sign in
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
          <MDBBtn className="p-0 m-0" onClick={(e) => onRegisterClick(e)}>
            No login details? Sign up here.
          </MDBBtn>
        </MDBCol>
      </MDBRow>

      <MDBModal isOpen={registerModalOpen} toggle={() => setRegisterModalOpen(!registerModalOpen)}>
        <MDBModalHeader>Sign up</MDBModalHeader>
        <Register setRegisterModalOpen={setRegisterModalOpen} onRegisterComplete={onRegisterComplete} />
      </MDBModal>

      {newUser && (
        <MDBModal isOpen={confirmModalOpen} toggle={() => setConfirmModalOpen(!confirmModalOpen)}>
          <MDBModalHeader>Confirm your email address</MDBModalHeader>
          <ConfirmRegister user={newUser} onConfirmComplete={onConfirmComplete} />
        </MDBModal>
      )}
    </MDBContainer>
  );
};

export default Login;
