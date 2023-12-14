import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
} from '@mui/material'
import AddProduct from '../modals/AddProduct';

function AddLineItem({ products, onAddLineItem, addedSKUs, onFetchProducts }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);

  function handleProductChange(event, newValue) {
    setSelectedProduct(newValue);

    // Check if the selected product has already been added
    if (newValue && addedSKUs.includes(newValue.sku)) {
      setError(`Product with SKU ${newValue.sku} has already been added`);
    } else {
      setError('');
    }
  }

  function handleQuantityChange(event) {
    const newQuantity = parseInt(event.target.value, 10);

    // validate qty
    if (newQuantity <= 0) {
      setError('Quantity must be at least 1');
    } else if (selectedProduct && newQuantity > selectedProduct.quantityAvailable) {
      setError(`Quantity exceeds available quantity: ${selectedProduct.quantityAvailable}`);
    } else {
      setError('');
    }

    setQuantity(newQuantity);
  }

  function handleAddLineItem() {
    if (selectedProduct && quantity >= 1 && quantity <= selectedProduct.quantityAvailable) {
      const skuToAdd = selectedProduct.sku;

      if (addedSKUs.includes(skuToAdd)) {
        setError(`Product with SKU ${skuToAdd} has already been added`);
      } else {
        onAddLineItem(skuToAdd, quantity);
        setSelectedProduct(null);
        setQuantity('');
        setError('');
      }
    }
  }

  const openAddProductModal = () => setAddProductModalOpen(true);
  const closeAddProductModal = () => setAddProductModalOpen(false);

  return (
    <div className='lineitem-container'>
      {/* Autocomplete for selecting products */}
      <Autocomplete
        size='small'
        options={products}
        getOptionLabel={(option) => option.sku}
        value={selectedProduct}
        onChange={handleProductChange}
        renderInput={(params) => <TextField {...params} label="Search SKU" />}
        noOptionsText={
          <Button
            size="small"
            variant="outlined"
            onClick={openAddProductModal}
            style={{ marginLeft: 10 }}
          >
            Add Product
          </Button>
        }
      />
      {/* Input field for entering quantity */}
      <TextField
        size='small'
        type="number"
        label="Quantity"
        value={quantity}
        onChange={handleQuantityChange}
        error={error}
        helperText={error}
      />

      {/* Button to add the line item */}
      <Button
        style={{ height: '36px' }}  // Set a fixed height for the button
        size='small'
        className='lineitem-button'
        onClick={handleAddLineItem}
        variant='contained'
        color='success'
        disabled={error || quantity < 1}
      >
        Add
      </Button>
      <AddProduct
        isOpen={isAddProductModalOpen}
        onClose={closeAddProductModal}
        onFetchProduct={onFetchProducts}
      />
    </div>
  );
}

export default AddLineItem;
