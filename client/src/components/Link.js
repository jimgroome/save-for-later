import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";

const Link = ({ link, onDeleteClick = null }) => {
  return (
    <tr key={link.uuid}>
      <td>
        <a href={link.url} target="_blank" rel="noreferrer" className="d-block">
          {link.title}
        </a>
      </td>
      {onDeleteClick && (
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
