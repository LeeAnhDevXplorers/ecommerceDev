// CategoryPagination.js
import { Pagination } from '@mui/material';
import React from 'react';

const CategoryPagination = ({ totalPages, currentPage, onChange }) => (
  <Pagination
    count={totalPages}
    page={currentPage}
    showFirstButton
    showLastButton
    onChange={onChange}
    color="primary"
    className="pagination"
  />
);

export default CategoryPagination;
