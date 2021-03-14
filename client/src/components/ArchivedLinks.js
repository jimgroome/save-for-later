import { MDBBtn, MDBCol, MDBCollapse, MDBIcon, MDBRow } from "mdbreact";
import React, { useState } from "react";
import Links from "./Links";

const ArchivedLinks = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  let buttonText = "Show archived links";
  if (isOpen) buttonText = "Hide archived links";
  return (
    <>
      <MDBRow>
        <MDBCol>
          <MDBBtn onClick={() => toggleOpen()} className="mb-4" color="primary">
            {buttonText} <MDBIcon icon={isOpen ? "caret-up" : "caret-down"} className="ml-4" />
          </MDBBtn>
        </MDBCol>
      </MDBRow>
      <MDBCollapse isOpen={isOpen}>
        <MDBRow>
          <MDBCol>
            <Links links={links} />
          </MDBCol>
        </MDBRow>
      </MDBCollapse>
    </>
  );
};

export default ArchivedLinks;
