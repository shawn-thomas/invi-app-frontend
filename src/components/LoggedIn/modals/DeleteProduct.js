import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function DeleteProduct({ isOpen, onClose, onConfirm, seletedSku }) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        boxShadow: 24,
        p: 4,
        textAlign: 'left'
      }}>
        <Typography id="delete-product-modal-title" variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Are you sure you want to delete this product?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
          <Button
            onClick={onConfirm}
            variant="outlined"
            color="primary">
            Confirm
          </Button>
          <Button
            onClick={onClose}
            color='error'
            sx={{ marginRight: 2 }}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteProduct;