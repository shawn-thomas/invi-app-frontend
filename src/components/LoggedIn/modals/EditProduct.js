import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InviApi from '../../../api';
import Alert from '../../../common/Alert';

function EditProduct({ isOpen, onClose, onUpdate, initialData, formErrors }) {
  const [editedData, setEditedData] = useState(initialData);

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    setEditedData(initialData);
  }, [initialData]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogContent>
        {formErrors.length > 0 && (
          <Alert messages={formErrors} />
        )}
        <TextField
          label="Product Name"
          name="productName"
          value={editedData?.productName || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={editedData?.description || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          value={editedData?.price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity in Stock"
          name="quantityAvailable"
          value={editedData?.quantityAvailable || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onUpdate(editedData)} variant="outlined" color="primary">
          Update
        </Button>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProduct;
