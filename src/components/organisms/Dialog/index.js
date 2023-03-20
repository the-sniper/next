import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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
