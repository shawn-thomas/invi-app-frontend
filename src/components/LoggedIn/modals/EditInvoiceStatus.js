import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

function EditInvoiceStatus({
  isConfirmationModalOpen,
  setConfirmationModalOpen,
  handleMarkAsPaid,
  invoiceId,
}) {
  return (
    <Dialog
      open={isConfirmationModalOpen}
      onClose={() => setConfirmationModalOpen(false)}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to confirm payment for Invoice <b>#{invoiceId}</b>?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setConfirmationModalOpen(false);
          handleMarkAsPaid(invoiceId);
        }} color="primary">
          Confirm
        </Button>
        <Button onClick={() => setConfirmationModalOpen(false)} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditInvoiceStatus;
