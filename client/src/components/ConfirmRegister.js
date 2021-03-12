import Auth from "@aws-amplify/auth";
import { MDBBtn, MDBModalBody, MDBModalFooter } from "mdbreact";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ConfirmRegister = ({ user, onConfirmComplete }) => {
  const [code, setCode] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await Auth.confirmSignUp(user.userSub, code)
        .then(() => onConfirmComplete())
        .catch((e) => {
          console.log(e);
          if (e.code === "CodeMismatchException") toast.error("Incorrect code entered. Please try again.");
        });
    } else {
      toast.error("Please enter your confirmation code.");
    }
  };
  const validate = () => {
    let response = false;
    if (code !== "") response = true;
    return response;
  };
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <MDBModalBody>
        <p>
          A confirmation code has been sent to {user.codeDeliveryDetails.Destination}. Please enter this code below.
        </p>
        <div className="form-group">
          <label htmlFor="code">Confirmation code</label>
          <input type="num" className="form-control" id="code" onChange={(e) => setCode(e.target.value)} value={code} />
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn type="submit" color="primary" className="float-right">
          OK
        </MDBBtn>
      </MDBModalFooter>
    </form>
  );
};

export default ConfirmRegister;
