import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';

const CategoryForm = ({
  formFields,
  handleInputChange,
  formErrors,
  bgColor,
  isShowCatPage,
  loading,
  handleSelectChange,
  catData,
}) => {
  return (
    <div className="form-group">
      {isShowCatPage ? (
        <>
          <h6 className="mb-2">Category</h6>
          <FormControl fullWidth variant="outlined">
            <Select
              labelId="category-select-label"
              id="category-select"
              value={formFields.category || ''}
              onChange={handleSelectChange}
              name="category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                Array.isArray(catData) &&
                catData.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {formErrors.subCat && (
            <span className="error-message">{formErrors.subCat}</span>
          )}
          <h6 className="mb-2">SUB CATEGORY NAME</h6>
          {formErrors.subCat && (
            <span style={{ fontSize: '1.4rem' }} className="text-danger">
              {formErrors.subCat}
            </span>
          )}
          <input
            type="text"
            name="subCat"
            value={formFields.subCat || ''}
            onChange={handleInputChange}
            className={formErrors.subCat ? 'input-error' : ''}
          />
        </>
      ) : (
        <>
          <h6 className="mb-2">CATEGORY NAME</h6>
          {formErrors.name && (
            <span style={{ fontSize: '1.4rem' }} className="text-danger">
              {formErrors.name}
            </span>
          )}
          <input
            type="text"
            name="name"
            value={formFields.name || ''}
            onChange={handleInputChange}
            className={formErrors.name ? 'input-error' : ''}
            style={{ marginBottom: '14px' }}
          />
          <h6 className="mb-2">CATEGORY COLOR</h6>
          <FormControl fullWidth variant="outlined">
            <Select
              labelId="color-select-label"
              id="color-select"
              value={formFields.color || ''}
              onChange={handleInputChange}
              name="color"
              className={formErrors.color ? 'input-error' : ''}
            >
              {Array.isArray(bgColor) &&
                bgColor.map((colorCode, index) => (
                  <MenuItem
                    key={index}
                    value={colorCode}
                    style={{ backgroundColor: colorCode }}
                  >
                    {colorCode}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {formErrors.color && (
            <span className="error-message">{formErrors.color}</span>
          )}
        </>
      )}

    </div>
  );
};

export default CategoryForm;
