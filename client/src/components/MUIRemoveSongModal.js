import { useContext } from "react";
import GlobalStoreContext from "../store";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "2%",
  boxShadow: 5,
  p: 3,
};

export default function MUIRemoveSongModal() {
  const { store } = useContext(GlobalStoreContext);

  function handleConfirmRemoveSong() {
    store.addRemoveSongTransaction();
  }

  function handleCancelRemoveSong() {
    store.hideModals();
  }

  let modalClass = "modal";
  if (store.isRemoveSongModalOpen()) {
    modalClass += " is-visible";
  }
  let songTitle = "";
  if (store.currentSong) {
    songTitle = store.currentSong.title;
  }

  return (
    <Modal
      open={store.currentModal === "REMOVE_SONG"} // ! This line handles whether a modal shows up when the button is clicked on
    >
      <Box sx={style}>
        <div
          id="remove-song-modal"
          className={modalClass}
          data-animation="slideInOutLeft"
        >
          <div className="modal-dialog" id="verify-remove-song-root">
            <header className="dialog-header">
              <div id="remove-song-title">Remove {songTitle}?</div>
              <div className="">
                Are you sure you wish to permanently remove <b>{songTitle}</b>{" "}
                from the playlist?
              </div>
            </header>

            <div id="confirm-cancel-container">
              <input
                type="button"
                id="remove-song-confirm-button"
                className="modal-button"
                onClick={handleConfirmRemoveSong}
                value="Confirm"
              />
              <input
                type="button"
                id="remove-song-cancel-button"
                className="modal-button"
                onClick={handleCancelRemoveSong}
                value="Cancel"
              />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
