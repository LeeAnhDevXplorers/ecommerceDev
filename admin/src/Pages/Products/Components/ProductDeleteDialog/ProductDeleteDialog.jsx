import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const ProductDeleteDialog = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose} className="edit-modal">
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText className="text-center mt-4 mb-0">
          Bạn có chắc chắn muốn xóa danh mục này không?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            console.log('Cancel button clicked'); // Debug log for Cancel button
            onClose();
          }}
          style={{ fontSize: '1.6rem' }}
          variant="outlined"
        >
          Hủy
        </Button>
        <Button
          onClick={() => {
            console.log('Delete button clicked'); // Debug log for Delete button
            onDelete();
          }}
          color="error"
          className="btn-lg"
          style={{ fontSize: '1.6rem', border: '1px solid red' }}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDeleteDialog;
