// import { MDBBtn, MDBIcon } from "mdbreact";
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ authenticated }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top mb-4">
      <Link to="/" className="navbar-brand">
        Save for later
      </Link>
      {/* {authenticated && (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/add" className="nav-link">
              <MDBBtn color="primary">
                <MDBIcon icon="plus" className="mr-2" />
                Add
              </MDBBtn>
            </Link>
          </li>
        </ul>
      )} */}
    </nav>
  );
};

export default Header;
