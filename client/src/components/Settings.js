import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";
import React from "react";

const Settings = ({ settingsModalOpen, setSettingsModalOpen, onSettingsSave, onLogoutClick }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    onSettingsSave();
  };
  return (
    <MDBModal isOpen={settingsModalOpen} toggle={setSettingsModalOpen}>
      <MDBModalHeader>Settings</MDBModalHeader>
      <form onSubmit={(e) => onSubmit(e)}>
        <MDBModalBody>
          <MDBBtn color="danger" onClick={(e) => onLogoutClick(e)}>
            Sign out
          </MDBBtn>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn onClick={() => setSettingsModalOpen(!settingsModalOpen)} color="secondary">
            Cancel
          </MDBBtn>
          <MDBBtn type="submit" onClick={(e) => onSubmit(e)} color="primary">
            Save
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default Settings;
