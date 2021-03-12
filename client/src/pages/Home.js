import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import Links from "../components/Links";
import apiGatewayCall from "../helpers/apiGatewayCall";

const Home = ({ setLoading, onLogoutClick }) => {
  const [activeLinks, setActiveLinks] = useState(null);
  const [archivedLinks, setArchivedLinks] = useState(null);

  const [linkToDelete, setLinkToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    getLinks();
    // eslint-disable-next-line
  }, []);

  const getLinks = async () => {
    setLoading(true);
    await apiGatewayCall("links", "get")
      .then((data) => {
        setActiveLinks(data.active);
        setArchivedLinks(data.archived);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  const onDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiGatewayCall(`links/${linkToDelete}`, "del")
      .then(async () => {
        setDeleteModalOpen(false);
        setLoading(false);
        await getLinks();
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  const onDeleteClick = (e, id) => {
    e.preventDefault();
    setDeleteModalOpen(true);
    setLinkToDelete(id);
  };
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };
  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol>
          <h1>
            Saved links
            <MDBBtn color="primary" onClick={(e) => getLinks()} className="float-right">
              <MDBIcon icon="sync" />
            </MDBBtn>
          </h1>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          {activeLinks &&
            (activeLinks.length > 0 ? (
              <Links links={activeLinks} onDeleteClick={onDeleteClick} />
            ) : (
              <p>Nothing found</p>
            ))}
        </MDBCol>
      </MDBRow>
      {archivedLinks && archivedLinks.length > 0 && (
        <MDBRow>
          <MDBCol>
            <h2>Archived links</h2>
            <Links links={archivedLinks} onDeleteClick={onDeleteClick} />
          </MDBCol>
        </MDBRow>
      )}
      <MDBModal toggle={toggleDeleteModal} isOpen={deleteModalOpen} fade={false}>
        <MDBModalHeader>Confirm archive</MDBModalHeader>
        <MDBModalBody>Archive this link?</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              setLinkToDelete(null);
              toggleDeleteModal();
            }}
          >
            Cancel
          </MDBBtn>
          <MDBBtn color="danger" onClick={(e) => onDelete(e)}>
            OK
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
      <MDBRow>
        <MDBCol>
          <MDBBtn color="danger" onClick={(e) => onLogoutClick(e)} className="my-4">
            Log out
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Home;
