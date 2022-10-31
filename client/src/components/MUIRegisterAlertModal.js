import { useContext } from "react";
import AuthContext from "../auth";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Alert } from "@mui/material";
import { AlertTitle } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  borderRadius: "1.5%",
  boxShadow: 5,
  p: 2,
};

export default function MUIRegisterAlertModal() {
  const { auth } = useContext(AuthContext);

  function handleCloseModal() {
    auth.closeModals();
  }

  return (
    <Modal open={true}>
      <Alert sx={style} severity="error" onClose={handleCloseModal}>
        <AlertTitle>Error</AlertTitle>
        <strong>{auth.errorType}</strong>
      </Alert>
    </Modal>
  );
}
