import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InviApi from '../../../api';
import Alert from '../../../common/Alert';


function AddCustomer({ isOpen, onClose, onFetchCustomer, onSuccess }) {
  const [newCustomerData, setNewCustomerData] = useState({
    customerName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState([]);

  /** Handles input changes and updates the new customer data. */
  function handleInputChange(evt) {
    const { name, value } = evt.target;
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  }

  /** Validates the form and displays errors. */
  function validateForm() {
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
  }

  /** Handles the addition of a new customer. */
  async function handleAddCustomer() {
    try {
      if (!validateForm()) {
        return;
      }

      await InviApi.createCustomer(newCustomerData);

      setNewCustomerData({
        customerName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });

      onSuccess();
      setFormErrors([]);
      onFetchCustomer();
      onClose();

    } catch (error) {
      console.error('Error adding customer:', error.message);
      setFormErrors(error);
    }
  };


  /** Closes the dialog and resets the form. */
  function handleClose() {
    setNewCustomerData({
      customerName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    });

    setFormErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create New Customer</DialogTitle>
      <DialogContent>
        {formErrors.length > 0 && (
          <Alert messages={formErrors} />
        )}

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
          required
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
          required
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
          required
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
