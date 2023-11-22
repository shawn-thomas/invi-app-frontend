import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InviApi from '../../../api';
import Alert from '../../../common/Alert';


function AddCustomer({ isOpen, onClose }) {
  const [newCustomerData, setNewCustomerData] = useState({
    customerName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!newCustomerData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!newCustomerData.firstName) {
      errors.firstName = 'First Name is required';
    }
    if (!newCustomerData.email) {
      errors.email = 'Email is required';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const res = await InviApi.createCustomer(newCustomerData);

      console.log('Response from createCustomer:', res);

      setNewCustomerData({
        customerName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });

      onClose();
    } catch (error) {
      console.error('Error adding customer:', error.message);
    }
  };

  const handleClose = () => {
    setNewCustomerData({
      customerName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create New Customer</DialogTitle>
      <DialogContent>
        <TextField
          label="Customer Name"
          name="customerName"
          value={newCustomerData.customerName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.customerName)}
          helperText={validationErrors.customerName}
          required
        />
        <TextField
          label="First Name"
          name="firstName"
          value={newCustomerData.firstName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.firstName)}
          helperText={validationErrors.firstName}
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={newCustomerData.lastName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={newCustomerData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.email)}
          helperText={validationErrors.email}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={newCustomerData.phone}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.phone)}
          helperText={validationErrors.phone}
        />
        <TextField
          label="Address"
          name="address"
          value={newCustomerData.address}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.address)}
          helperText={validationErrors.address}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddCustomer} variant="outlined" color="primary">
          Add Customer
        </Button>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCustomer;
