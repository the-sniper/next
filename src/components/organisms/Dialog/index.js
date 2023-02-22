import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props) {
  const open = props.open;
  const openFunction = props.function;
  const title = props.title;
  const maxWidth = props.maxWidth;
  return (
    <>
      <Dialog
        className={`${props.className} customDialog`}
        open={open}
        onClose={openFunction}
        aria-labelledby="form-dialog-title"
        maxWidth={maxWidth ? maxWidth : 'sm'}
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </>
  );
}
