import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme, maxWidth) => ({
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "100%",
    maxWidth: "46rem",
  },
}));

const Popup = ({
  open,
  handleClose,
  children,
  modaltitle,
  size,
  className,
}) => {
  const classes = useStyles();

  return (
    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      className={classes.modal + ' ' +className}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <div className="modal fade show custom-modal">
            <div className={`modal-dialog modal-${size ? size : "lg"}`}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">{modaltitle}</h4>
                  <Button className="close" onClick={handleClose}>
                    <span className="material-icons">close</span>
                  </Button>
                </div>
                <div className="modal-body cm-body">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default Popup;
