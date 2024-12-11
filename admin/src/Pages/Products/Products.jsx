import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import {
  Breadcrumbs,
  Chip,
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
} from '@mui/material';
import mongoose from 'mongoose';
import React, { useContext, useEffect, useState } from 'react';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import './Products.css';

// Assuming `context` is your Progress context
import { MyContext } from '../../App';
import ProductDeleteDialog from './Components/ProductDeleteDialog/ProductDeleteDialog';
import ProductEditDialog from './Components/ProductEditDialog/ProductEditDialog';
import ProductsTable from './Components/ProductsTable/ProductsTable';

const Products = () => {
  const [open, setOpen] = useState(false);
  const [showBy, setShowBy] = useState('');

  const [pRamData, setPRamData] = useState([]);
  const [pWeigthData, setPWeigthData] = useState([]);
  const [pSizeData, setPSizeData] = useState([]);
  const [subCatData, setsubCatData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [deleteID, setDeleteID] = useState(null);
  const [EditP, setEditP] = useState(null);
  const [subCatVal, setSubCatVal] = useState();
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages
  // Khởi tạo trạng thái form với các trường dữ liệu
  const context = useContext(MyContext);
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    images: [],
    brand: '',
    price: '',
    oldPrice: '',
    category: '',
    subCat: '',
    catName: '',
    subName: '',
    countInStock: '',
    discount: '',
    weightName: [],
    ramName: [],
    sizeName: [],
    isFeatured: false,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [prams, weights, sizes] = await Promise.all([
          fetchDataFromApi('/api/prams'),
          fetchDataFromApi('/api/weight'),
          fetchDataFromApi('/api/psize'),
        ]);
        setPRamData(prams.data || []);
        setPWeigthData(weights.data || []);
        setPSizeData(sizes.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi('/api/category')
      .then((res) => {
        if (Array.isArray(res.categoryList)) {
          setCatData(res.categoryList);
        } else {
          setCatData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCatData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchCategories = async (page = 1) => {
    setLoading(true); // Đặt trạng thái loading thành true
    try {
      const response = await fetchDataFromApi(`/api/subCategory`);
      setsubCatData(response); // Cập nhật trạng thái catData với dữ liệu nhận được
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

  const handleSelectChange = (e, fieldName) => {
    setFormFields((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }));
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchDataFromApi(
        `/api/products?page=${page}&perPage=10`
      );
      console.log('API Response:', response);
      if (response && response.data) {
        setProductList(Array.isArray(response.data) ? response.data : []);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || page);
      } else {
        setProductList([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      context.setAlertBox({
        error: true,
        msg: 'Failed to fetch products',
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Đóng dialog xóa
    setDeleteID(null); // Đặt lại ID xóa
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleOpenDeleteDialog = (_id) => {
    setDeleteID(_id); // Cập nhật ID của danh mục đang xóa
    setOpenDeleteDialog(true); // Mở dialog xóa
  };

  const changeInput = (e) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      [e.target.name]: e.target.value, // Cập nhật trường tương ứng trong form
    }));
  };

  const selectCat = (cat) => {
    formFields.catName = cat;
  };

  // Xử lý thay đổi danh mục
  const handleSelectSubCatChange = (e) => {
    setSubCatVal(e.target.value);
    setFormFields(() => ({
      ...formFields,
      subCat: e.target.value,
    }));
    formFields.subName = e.target.value;
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
    fetchProducts(value); // Fetch products for the selected page
  };

  const handleClose = () => {
    setOpen(false); // Đóng dialog
  };

  const handleEditP = async (_id) => {
    setOpen(true);
    setEditP(_id);
    try {
      const res = await fetchDataFromApi(`/api/products/${_id}`);
      if (res) {
        console.log('Fetched product data:', res);

        setFormFields({
          name: res.name,
          description: res.description,
          brand: res.brand || '',
          price: res.price || '',
          oldPrice: res.oldPrice || '',
          category: res.category ? res.category.name : '',
          subCat: res.subCat || '',
          subName: res.subName,
          catName: res.catName || '',
          countInStock: res.countInStock || '',
          isFeatured: res.isFeatured || false,
          discount: res.discount || '',
          weightName: res.weightName ? res.weightName.join(',') : '', // Gán mảng weightName vào chuỗi
          ramName: res.ramName ? res.ramName.join(',') : '', // Gán mảng ramName vào chuỗi
          sizeName: res.sizeName ? res.sizeName.join(',') : '', // Gán mảng sizeName vào chuỗi
        });

        // Kiểm tra và log thông tin hình ảnh
        console.log('Images from API:', res.images);
        setPreviews(res.images || []);
      }
    } catch (error) {
      console.error('Error fetching product data for edit:', error);
    }
  };

  const editPFun = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculate the updated price from oldPrice and discount
    const updatedPrice =
      Number(formFields.oldPrice) -
      (Number(formFields.oldPrice) * (Number(formFields.discount) || 0)) / 100;

    try {
      const formData = new FormData();
      console.log('Form data before append:');
      console.log('weightName:', formFields.weightName);
      console.log('ramName:', formFields.ramName);
      console.log('sizeName:', formFields.sizeName);

      // Append fields to formData, ensuring values are valid
      formData.append('name', formFields.name?.trim() || '');
      formData.append('description', formFields.description?.trim() || '');
      formData.append('brand', formFields.brand?.trim() || '');
      formData.append('price', Number(updatedPrice) || 0); // Updated price after discount
      formData.append('oldPrice', Number(formFields.oldPrice) || 0);
      formData.append('category', formFields.category?.trim() || '');
      formData.append('subCat', formFields.subCat?.trim() || '');
      formData.append('catName', formFields.catName || '');
      formData.append('subName', formFields.subName || '');
      formData.append('countInStock', Number(formFields.countInStock) || 0);
      formData.append('discount', formFields.discount || 0);
      formData.append('isFeatured', Boolean(formFields.isFeatured));

      // Append weightName, ramName, sizeName if available
      if (formFields.weightName)
        formData.append('weightName', formFields.weightName);
      if (formFields.ramName) formData.append('ramName', formFields.ramName);
      if (formFields.sizeName) formData.append('sizeName', formFields.sizeName);

      // Handle existing images (if any)
      const existingImages = previews.filter(
        (preview) => typeof preview === 'string' && preview.startsWith('http')
      );
      if (existingImages.length > 0) {
        existingImages.forEach((image) =>
          formData.append('existingImages[]', image)
        ); // Array handling for multiple images
      }

      // Handle new images (if any)
      if (files.length > 0) {
        files.forEach((file) => {
          if (file instanceof File) formData.append('images', file); // Append each image
        });
      }

      // Make API request to update product
      await editData(`/api/products/${EditP}`, formData).then(async (res) => {
        setLoading(false);
        setPreviews([]); // Clear previews after successful update
        setFiles([]); // Clear file inputs
        await fetchProducts(); // Fetch updated product list
        handleClose(); // Close the modal or dialog
        context.setAlertBox({
          error: false,
          msg: 'Product updated successfully',
          open: true,
        });
      });
    } catch (error) {
      console.error('Error updating product:', error);
      context.setAlertBox({
        error: true,
        msg:
          error.response?.data?.message ||
          error.message ||
          'Failed to update product',
        open: true,
      });
    } finally {
      setLoading(false); // Always stop the loading state after the process is complete
    }
  };

  const handleDeleteConfirm = async () => {
    context.setProgress(30); // Set progress to 30% to indicate the deletion process has started

    try {
      await deleteData(`/api/products/${deleteID}`); // Call API to delete the product
      context.setProgress(70); // Set progress to 70% after the deletion request is made
      await fetchProducts(); // Reload the product list after deletion
      context.setProgress(100); // Set progress to 100% after products are fetched
      handleCloseDeleteDialog(); // Close the delete dialog
    } catch (error) {
      console.error('Failed to delete product:', error);
      context.setProgress(0); // Optionally reset progress to 0% on error or handle as needed
    }
  };

  const onChangeFile = (e) => {
    if (e?.target?.files) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => {
        if (file.size > maxSize) {
          context.setAlertBox({
            error: true,
            msg: `File ${file.name} is too large. Max size is 5MB`,
            open: true,
          });
          return false;
        }

        if (!allowedTypes.includes(file.type)) {
          context.setAlertBox({
            error: true,
            msg: `File ${file.name} is not a supported image type`,
            open: true,
          });
          return false;
        }

        return true;
      });

      setFiles((prevFiles) => [...prevFiles, ...validFiles]);

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Cập nhật useEffect để cleanup
  useEffect(() => {
    fetchProducts();

    return () => {
      // Cleanup previews khi component unmount
      previews.forEach((preview) => {
        if (typeof preview === 'string' && !preview.startsWith('http')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 p-3 mt-4 w-100">
        <div className="MuiBox-root css-99a237 d-flex">
          <h6 className="MuiTypography-root MuiTypography-h6 css-66yapz-MuiTypography-root">
            Danh sách sản phẩm hiện có
          </h6>
          <Breadcrumbs
            style={{ color: '#FFF' }}
            aria-label="breadcrumb"
            className="ml-auto breadcrumbs_"
          >
            <Chip
              style={{ color: '#FFF' }}
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon style={{ color: '#FFF' }} fontSize="small" />}
            />
            <Chip
              style={{ color: '#FFF' }}
              href="#"
              label="Products"
              icon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>
        <div className="row cardFilter mt-4">
          <div className="col-md-3">
            <h4>SHOW BY</h4>
            <Select
              value={formFields.category || ''}
              onChange={(e) => handleSelectChange(e, 'category')}
              displayEmpty
              className="w-100"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                catData.map((item, index) => (
                  <MenuItem key={index} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </div>
        </div>
        <ProductsTable
          productList={productList}
          context={context}
          loading={loading}
          handleEditP={handleEditP}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          isHomePage={true}
        />

        <div className="d-flex tableFooter">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            color="primary"
            className="pagination"
          />
        </div>
        <ProductDeleteDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onDelete={handleDeleteConfirm}
        />
        <ProductEditDialog
          open={open}
          handleClose={handleClose}
          changeInput={changeInput}
          handleInputChange={handleInputChange}
          editPFun={editPFun}
          loading={loading}
          formFields={formFields}
          previews={previews}
          onChangeFile={onChangeFile}
          removeFile={removeFile}
          handleSelectChange={handleSelectChange}
          selectCat={selectCat}
          handleSelectSubCatChange={handleSelectSubCatChange}
        />
      </div>
    </div>
  );
};

export default Products;
