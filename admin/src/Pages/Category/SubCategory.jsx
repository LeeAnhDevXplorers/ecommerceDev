import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import {
  Backdrop,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { bgColor } from '../../assets/assets';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import './Category.css';
import CategoryPagination from './Components/CategoryPagination/CategoryPagination';
import CategoryTable from './Components/CategoryTable/CategoryTable';
import DeleteDialog from './Components/DeleteDialog/DeleteDialog';
import EditCategoryDialog from './Components/EditCategoryDialog/EditCategoryDialog';

// Styled Component
const StyleBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

// Main Component
const SubCategory = () => {
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    category: '',
    subCat: '',
  });
  const [open, setOpen] = useState(false);
  const [catData, setCatData] = useState([]);
  const [editID, setEditID] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const fetchCategories = async (page = 1) => {
    setLoading(true); // Đặt trạng thái loading thành true
    try {
      const response = await fetchDataFromApi(`/api/subCategory`);
      setCatData(response); // Cập nhật trạng thái catData với dữ liệu nhận được
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false); // Đặt trạng thái loading thành false
    }
  };
  useEffect(() => {
    context.setProgress(30);
    fetchCategories(context.setProgress(100)); // Gọi hàm để tải danh mục khi component được mount
  }, []);

  const editCat = async (_id) => {
    setOpen(true);
    setEditID(_id);
    try {
      const res = await fetchDataFromApi(`/api/subCategory/${_id}`);
      if (res) {
        setFormFields({
          category: res.category,
          subCat: res.subCat,
        });
        // Set previews from existing images
        setPreviews(res.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch category data:', error);
    }
  };
  const handleOpenDeleteDialog = (_id) => {
    setDeleteID(_id); // Cập nhật ID của danh mục đang xóa
    setOpenDeleteDialog(true); // Mở dialog xóa
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Đóng dialog xóa
    setDeleteID(null); // Đặt lại ID xóa
  };

  const handleDeleteConfirm = async () => {
    context.setProgress(30); // Set progress to 30% to indicate the deletion process has started

    try {
      await deleteData(`/api/subCategory/${deleteID}`); // Call API to delete the category
      context.setProgress(70); // Set progress to 70% after the deletion request is made
      await fetchCategories(); // Reload the category list after deletion
      context.setProgress(100); // Set progress to 100% after categories are fetched
      handleCloseDeleteDialog(); // Close the delete dialog
    } catch (error) {
      console.error('Failed to delete category:', error);
      context.setProgress(0); // Optionally reset progress to 0% on error or handle as needed
    }
  };

  const handleChange = async (event, value) => {
    context.setProgress(30); // Set progress to 30%

    try {
      await fetchCategories(value); // Wait for the fetchCategories to complete
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle error appropriately, maybe set progress to an error state
    } finally {
      context.setProgress(100); // Set progress to 100% after fetching
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 p-3 mt-4 w-100">
          {/* Header */}
          <div className="MuiBox-root css-99a237 d-flex">
            <h6 className="MuiTypography-root MuiTypography-h6 css-66yapz-MuiTypography-root">
              Projects Table
            </h6>
            <Breadcrumbs
              aria-label="breadcrumb"
              className="ml-auto breadcrumbs_"
            >
              <StyleBreadcrumb
                component="a"
                href="/"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyleBreadcrumb
                href="#"
                label="Products"
                deleteIcon={<ExpandMoreIcon />}
              />
              <Button className="btn-blue btn-lg">
                <Link style={{ color: '#fff' }} to={'/category/categoryadd'}>
                  Thêm danh mục
                </Link>
              </Button>
            </Breadcrumbs>
          </div>

          {/* Table */}
          <div className="table-responsive w-100 mt-5">
            <CategoryTable
              isShowTable={false}
              catData={catData}
              editCat={editCat}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              isShowIcon={false}
            />

            {/* Footer */}
            <div className="d-flex tableFooter">
              <CategoryPagination
                totalPages={catData.totalPages || 1}
                currentPage={catData.currentPage || 1}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <DeleteDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onDelete={handleDeleteConfirm}
        />

        <Backdrop
          sx={{
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            // zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: 'opacity 0.3s ease-in-out',
            zIndex: 9999,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" size={50} thickness={2} />
        </Backdrop>
      </div>
    </>
  );
};

export default SubCategory;
