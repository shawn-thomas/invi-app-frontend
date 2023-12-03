import React, { useState } from 'react';
import {
    Grid,
    Autocomplete,
    TextField,
    Typography,
    Button,
    Box
  } from '@mui/material';
import AddCustomer from '../modals/AddCustomer';

function InvoiceRecipient({
  customers,
  onInputChange,
  onAddInvoiceRecipient,
  onDeleteInvoiceRecipient,
}) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  function handleCustomerSelect(event, value) {
    setSelectedCustomer(value);

    const recipient = {
      name: value ? value.customerName : '',
      address: '',
      email: value ? value.email : '',
    };

    updateRecipient(recipient);
  }

  function handleClearRecipient() {
    setSelectedCustomer(null);
    const emptyRecipient = { name: '', address: '', email: '' };
    updateRecipient(emptyRecipient);
    onDeleteInvoiceRecipient();
  }

  function updateRecipient(recipient) {
    onInputChange('recipient', 'name', recipient.name);
    onInputChange('recipient', 'address', recipient.address);
    onInputChange('recipient', 'email', recipient.email);

    onAddInvoiceRecipient(recipient);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        {selectedCustomer ? (
          <Box>
            <Typography variant="body2">{selectedCustomer.customerName}</Typography>
            <Typography variant="body2">{`First Name: ${selectedCustomer.firstName}`}</Typography>
            <Typography variant="body2">{`Last Name: ${selectedCustomer.lastName}`}</Typography>
            <Typography variant="body2">{`Email: ${selectedCustomer.email}`}</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClearRecipient}
              style={{ marginTop: 10 }}
            >
              Change Recipient
            </Button>
          </Box>
        ) : (
          <Autocomplete
            size="small"
            options={customers}
            getOptionLabel={(option) => option.customerName || ''}
            onChange={handleCustomerSelect}
            renderInput={(params) => (
              <TextField {...params} label="Select Customer" variant="outlined" fullWidth />
            )}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default InvoiceRecipient;
