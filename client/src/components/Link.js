import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";

const Link = ({ link, onDeleteClick }) => {
  return (
    <tr key={link.uuid}>
      <td>
        <a href={link.url} target="_blank" rel="noreferrer" className="d-block">
          {link.title}
        </a>
      </td>
      {link.status !== "archived" && (
        <td className="text-right">
          <MDBBtn onClick={(e) => onDeleteClick(e, link.uuid)} color="danger" size="sm">
            <MDBIcon icon="times" />
          </MDBBtn>
        </td>
      )}
    </tr>
  );
};

export default Link;
