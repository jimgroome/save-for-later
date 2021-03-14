// import { MDBBtn, MDBIcon } from "mdbreact";
import { MDBBtn, MDBIcon } from "mdbreact";
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ variant = "logged-out", onSettingsClick = null }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top mb-4">
      <Link to="/" className="navbar-brand">
        Save for later
      </Link>
      {variant === "home" && (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <MDBBtn color="primary" onClick={() => onSettingsClick()}>
              <MDBIcon icon="cog" />
            </MDBBtn>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
