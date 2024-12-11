// DeleteDialog.js
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';

const DeleteDialog = ({ open, onClose, onDelete }) => (
  <Dialog
    sx={{ '& .MuiDialog-paper': { width: '600px', padding: '16px' } }}
    open={open}
    onClose={onClose}
  >
    <DialogTitle className="text-center" sx={{ fontSize: '1.875rem' }}>
      Bạn có chắc muốn xóa danh mục này?
    </DialogTitle>
    <DialogActions
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button
        sx={{
          fontSize: '1.4rem',
          color: 'red',
          border: '1px solid red',
          padding: '10px 30px',
        }}
        onClick={onDelete}
        color="secondary"
        autoFocus
      >
        Xóa
      </Button>
      <Button
        sx={{
          fontSize: '1.4rem',
          border: '1px solid blue',
          padding: '10px 30px',
        }}
        onClick={onClose}
        color="primary"
      >
        Hủy
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
