import React from 'react';
import {
    Grid,
    TextField,
    Typography
  } from '@mui/material';

const InvoiceSender = ({ sender }) => {
  return (
    <Grid>
      <div>
      <Typography variant="body2">{`${sender.firstName} ${sender.lastName}`}</Typography>
      <Typography variant="body2">{sender.email}</Typography>
      </div>
    </Grid>
  );
};

export default InvoiceSender;
