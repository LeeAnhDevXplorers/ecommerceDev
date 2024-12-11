import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import React  from 'react';
import ImageUpload from '../../../../Components/ImageUpload/ImageUpload';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const EditCategoryDialog = ({
  open,
  formFields,
  handleInputChange,
  changeInput,
  loading,
  bgColor,
  editCategoryFun,
  handleClose,
  previews = [],
  onChangeFile,
  removeFile,
}) => {
  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-4">
      <div className="col-span-4 row-span-5 ">
        <Dialog
          fullScreen
          open={open}
          // maxWidth="sm"
          sx={{ width: '1000px' }}
          TransitionComponent={Transition}
        >
          <DialogTitle sx={{ fontSize: '2rem', fontWeight: '500' }}>
            Chỉnh sửa danh mục
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ fontSize: '1.6rem', marginBottom: '10px' }}
            >
              Vui lòng nhập thông tin danh mục
            </DialogContentText>

            <div className="grid grid-cols-4 grid-rows-5 gap-4">
              <div className="col-span-4 row-span-5">
                <form onSubmit={editCategoryFun}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Tên danh mục"
                    type="text"
                    fullWidth
                    name="name"
                    value={formFields.name}
                    onChange={changeInput}
                    sx={{ outline: 'none', border: 'none' }}
                  />

                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="color-select-label">Màu sắc</InputLabel>
                    <Select
                      margin="dense"
                      label="Màu sắc"
                      fullWidth
                      labelId="color-select-label"
                      id="color-select"
                      value={formFields.color}
                      onChange={handleInputChange}
                      name="color"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                      }}
                    >
                      {bgColor.map((colorCode, index) => (
                        <MenuItem
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                          }}
                          key={index}
                          value={colorCode}
                          style={{
                            // backgroundColor: colorCode,
                            padding: '12px',
                          }}
                        >
                          <span
                            className="block rounded-full absolute"
                            style={{
                              background: colorCode,
                              width: '15px',
                              height: '15px',
                              marginRight: '10px',
                            }}
                          ></span>
                          {colorCode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <ImageUpload
                    previews={previews}
                    onChangeFile={onChangeFile}
                    removeFile={removeFile}
                  />

                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      style={{ fontSize: '1.6rem' }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-blue btn-lg"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  </DialogActions>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EditCategoryDialog;
