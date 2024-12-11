import React from 'react';
import { Pagination } from '@mui/material';

const PaginationControl = ({ totalPages, currentPage, onPageChange }) => (
  <div className="d-flex tableFooter">
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      showFirstButton
      showLastButton
      color="primary"
      className="pagination"
    />
  </div>
);

export default PaginationControl;
