import { MDBBtn, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";
import React, { useState } from "react";
import toast from "react-hot-toast";
import apiGatewayCall from "../helpers/apiGatewayCall";

const Settings = ({ settingsModalOpen, setSettingsModalOpen, onLogoutClick, lists, getLinks }) => {
  const [newListName, setNewListName] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const [confirmSignOutModalOpen, setConfirmSignOutModalOpen] = useState(false);
  const [confirmDeleteListModalOpen, setConfirmDeleteListModalOpen] = useState(false);

  const onNewListSubmit = async (e, newListName) => {
    const validate = () => {
      let valid = true;
      if (newListName === "") {
        valid = false;
        toast.error("Please enter a list name.");
      }
      lists.forEach((list) => {
        if (list.title === newListName) {
          valid = false;
          toast.error(`A list with the name ${newListName} already exists. Please enter another name.`);
        }
      });
      return valid;
    };
    e.preventDefault();
    if (validate()) {
      setSaving(true);
      await apiGatewayCall("lists", "post", { body: { title: newListName } })
        .then(async () => {
          await getLinks().then(() => {
            setNewListName("");
            setSaving(false);
          });
        })
        .catch((e) => console.log(e));
    }
  };

  const onListEditClick = (listId) => {
    console.log(`Editing ${listId}`);
  };
  const onListDeleteClick = async (list) => {
    setListToDelete(list);
    setConfirmDeleteListModalOpen(true);
  };
  const onConfirmListDelete = async () => {
    setDeleting(true);
    await apiGatewayCall("lists/" + listToDelete.uuid, "del")
      .then(async () => {
        await getLinks().then(() => {
          setConfirmDeleteListModalOpen(false);
          setListToDelete(null);
          setDeleting(false);
        });
      })
      .catch((e) => console.log(e));
  };
  return (
    <MDBModal isOpen={settingsModalOpen} toggle={setSettingsModalOpen}>
      <MDBModalHeader>Settings</MDBModalHeader>
      <MDBModalBody>
        <div className="settings-lists mb-4">
          <h5>Lists</h5>
          <form onSubmit={(e) => onNewListSubmit(e, newListName)}>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="newListName"
                      onChange={(e) => setNewListName(e.target.value)}
                      value={newListName}
                      placeholder="New list"
                    />
                  </td>
                  <td>
                    <MDBBtn
                      type="submit"
                      onClick={(e) => onNewListSubmit(e, newListName)}
                      color="primary"
                      className="float-right"
                    >
                      {saving ? <MDBIcon icon="sync" spin /> : <MDBIcon icon="save" />}
                    </MDBBtn>
                  </td>
                </tr>

                {lists &&
                  lists.length > 0 &&
                  lists.map((list) => {
                    if (list.uuid !== "none") {
                      return (
                        <tr key={list.uuid}>
                          <td>{list.label}</td>
                          <td className="text-right">
                            <MDBBtn onClick={() => onListEditClick(list.uuid)} className="p-0 mr-2" title="Rename">
                              <MDBIcon icon="edit" />
                            </MDBBtn>
                            <MDBBtn onClick={() => onListDeleteClick(list)} className="p-0 m-0" title="Delete">
                              <MDBIcon icon="times" />
                            </MDBBtn>
                          </td>
                        </tr>
                      );
                    }
                    else return false
                  })}
              </tbody>
            </table>
          </form>
        </div>

        {listToDelete && (
          <MDBModal
            isOpen={confirmDeleteListModalOpen}
            toggle={() => {
              setListToDelete(null);
              setConfirmDeleteListModalOpen(!confirmDeleteListModalOpen);
            }}
          >
            <MDBModalHeader>Confirm delete</MDBModalHeader>
            <MDBModalBody>
              Are you sure you want to delete the list "{listToDelete.label}"? All links in this list will also be
              deleted.
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  setListToDelete(null);
                  setConfirmDeleteListModalOpen(!confirmDeleteListModalOpen);
                }}
              >
                Cancel
              </MDBBtn>
              <MDBBtn color="danger" onClick={() => onConfirmListDelete()}>
                {deleting ? <MDBIcon icon="sync" spin /> : "Delete"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        )}

        <div className="settings-sign-out">
          <h5>Sign out</h5>
          <MDBBtn className="p-0 m-0 mb-2 btn-link" onClick={() => setConfirmSignOutModalOpen(true)}>
            Sign out on this device
          </MDBBtn>
          <MDBModal
            isOpen={confirmSignOutModalOpen}
            toggle={() => setConfirmSignOutModalOpen(!confirmSignOutModalOpen)}
          >
            <MDBModalHeader>Confirm sign out</MDBModalHeader>
            <MDBModalBody>Are you sure you want to sign out?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setConfirmSignOutModalOpen(false)}>
                Cancel
              </MDBBtn>
              <MDBBtn
                color="primary"
                onClick={() => {
                  setConfirmSignOutModalOpen(false);
                  onLogoutClick();
                }}
              >
                Sign out
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn onClick={() => setSettingsModalOpen(!settingsModalOpen)} color="primary">
          Close
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};

export default Settings;
