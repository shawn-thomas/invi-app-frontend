import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import InviApi from '../../../api';
import Alert from '../../../common/Alert';


function AddProduct({ isOpen, onClose, onFetchCustomer }) {
  const [newProductData, setNewProductData] = useState({
    sku: '',
    productName: '',
    description: '',
    price: '',
    quantityAvailable: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState([]);

  /** Handles input changes and updates the new customer data. */
  function handleInputChange(evt) {
    const { name, value } = evt.target;
    setNewProductData((prevData) => ({
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

    if (!newProductData.sku) {
      errors.sku = 'SKU is required';
    }
    if (!newProductData.productName) {
      errors.name = 'Product name is required';
    }
    if (!newProductData.price) {
      errors.price = 'Price is required';
    }
    if (!newProductData.quantityAvailable) {
      errors.quantity = 'Quantity is required';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  }

  /** Handles the addition of a new product. */
  async function handleAddProduct() {
    try {
      if (!validateForm()) {
        return;
      }

      const price = parseFloat(newProductData.price);
      const quantityAvailable = parseInt(newProductData.quantityAvailable);

      if (isNaN(price) || isNaN(quantityAvailable)) {
        setFormErrors(['Price and Quantity must be valid numbers']);
        return;
      }

      setNewProductData((prevData) => ({
        ...prevData,
        price,
        quantityAvailable,
      }));

      await InviApi.createProduct(newProductData);

      setNewProductData({
        sku: '',
        productName: '',
        description: '',
        price: '',
        quantityAvailable: '',
      });

      setFormErrors([]);
      onFetchCustomer();
      onClose();
    } catch (error) {
      setFormErrors([error.message]);
    }
  }

  /** Closes the dialog and resets the form. */
  function handleClose() {
    setNewProductData({
      sku: '',
      productName: '',
      description: '',
      price: '',
      quantityAvailable: '',
    });

    setFormErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        {formErrors.length > 0 && (
          <Alert messages={formErrors} />
        )}

        <TextField
          label="SKU"
          name="sku"
          value={newProductData.sku}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.sku)}
          helperText={validationErrors.sku}
          required
        />
        <TextField
          label="Name"
          name="productName"
          value={newProductData.productName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.productName)}
          helperText={validationErrors.productName}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={newProductData.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          value={newProductData.price}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.price)}
          helperText={validationErrors.price}
          required
        />
        <TextField
          label="Quantity"
          name="quantityAvailable"
          value={newProductData.quantityAvailable}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={Boolean(validationErrors.quantityAvailable)}
          helperText={validationErrors.quantityAvailable}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddProduct} variant="outlined" color="primary">
          Add Product
        </Button>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddProduct;
