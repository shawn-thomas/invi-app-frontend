import React, { useState, useEffect } from 'react';
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
  removeRecipient,
  formSubmitted,
  onFetchCustomers,
}) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

  function handleCustomerSelect(event, value) {
    setSelectedCustomer(value);

    const recipient = {
      handle: value ? value.handle : '',
      name: value ? value.customerName : '',
      address: '',
      email: value ? value.email : '',
    };

    updateRecipient(recipient);
  }

  // Reset the recipient state when the form is submitted
  useEffect(() => {
    if (formSubmitted) {
      setSelectedCustomer(null);
      const emptyRecipient = { name: '', address: '', email: '' };
      updateRecipient(emptyRecipient);
      removeRecipient();
    }
  }, [formSubmitted, removeRecipient]);

  function handleClearRecipient() {
    setSelectedCustomer(null);
    const emptyRecipient = { name: '', address: '', email: '' };
    updateRecipient(emptyRecipient);
    removeRecipient();
  }

  const openAddCustomerModal = () => setAddCustomerModalOpen(true);
  const closeAddCustomerModal = () => setAddCustomerModalOpen(false);
  function handleAddCustomerSuccess(newCustomer) {
    const customerData = newCustomer?.customer
    setSelectedCustomer(customerData);
    onFetchCustomers();
    const recipient = {
      handle: customerData ? customerData.handle : '',
      name: customerData ? customerData.customerName : '',
      address: '',
      email: customerData ? customerData.email : '',
    };

    updateRecipient(recipient);
    closeAddCustomerModal();
  };

  function updateRecipient(recipient) {
    onInputChange('recipient', 'handle', recipient.handle);
    onInputChange('recipient', 'name', recipient.name);
    onInputChange('recipient', 'address', recipient.address);
    onInputChange('recipient', 'email', recipient.email);
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
            noOptionsText={
              <Button
                size="small"
                variant="outlined"
                onClick={openAddCustomerModal}
                style={{ marginTop: 10 }}
              >
                Add Customer
              </Button>
            }
            onInputChange={(event, newInputValue) => {
              onInputChange('recipient', 'handle', newInputValue);
            }}
            isOptionEqualToValue={(option, value) => option.customerName === value.customerName}
            renderOption={(props, option, { inputValue }) => (
              <li {...props}>
                {option.customerName}
                {inputValue === option.customerName && (
                  <Button onClick={openAddCustomerModal}>Add</Button>
                )}
              </li>
            )}
          />
        )}
      </Grid>
      <AddCustomer
        isOpen={isAddCustomerModalOpen}
        onClose={closeAddCustomerModal}
        onSuccess={handleAddCustomerSuccess}
        onFetchCustomer={onFetchCustomers}

      />
    </Grid>
  );
}

export default InvoiceRecipient;
