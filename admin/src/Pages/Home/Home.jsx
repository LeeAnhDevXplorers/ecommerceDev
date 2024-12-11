import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaBagShopping, FaCartShopping } from 'react-icons/fa6';
import { GiStarsStack } from 'react-icons/gi';
import { HiDotsVertical } from 'react-icons/hi';
import { IoTimerOutline } from 'react-icons/io5';


import { MyContext } from '../../App';
import DashboardBox from './Components/DashboardBox';

import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import ProductsTable from '../Products/Components/ProductsTable/ProductsTable';
import './Home.css';
import ProductDeleteDialog from '../Products/Components/ProductDeleteDialog/ProductDeleteDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ITEM_HEIGHT = 48;
const data = [
  ['Year', 'Sales', 'Expenses'],
  ['2013', 1000, 400],
  ['2014', 1170, 460],
  ['2015', 660, 1120],
  ['2016', 1030, 540],
];

export const options = {
  chartArea: { width: '100%', height: '100%' },
  backgroundColor: 'transparent',
};

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setShowBy] = useState('');
  const [EditP, setEditP] = useState(null);
  const [showCat, setShowCat] = useState('');
  const [showBrand, setshowBrand] = useState('');
  const [showSearch, setshowSearch] = useState('');
  const [deleteID, setDeleteID] = useState(null);
  const [open, setOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const context = useContext(MyContext);
  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    images: [],
    brand: '',
    price: '',
    oldPrice: '',
    category: '',
    countInStock: '',
    isFeatured: false,
  });
  const opens = Boolean(anchorEl);
  useEffect(() => {
    fetchProducts(); // Initial fetch for products
  }, []);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchDataFromApi(`/api/products?page=${page}`);
      if (response.success) {
        setProductList(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.page);
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); 
    setDeleteID(null); // Đặt lại ID xóa
  };

  const handleOpenDeleteDialog = (_id) => {
    setDeleteID(_id); // Cập nhật ID của danh mục đang xóa
    setOpenDeleteDialog(false); // Mở dialog xóa
  };

  const handleClose = () => {
    setOpen(false); // Đóng dialog
    setAnchorEl(null);
  };

  const handleEditP = async (_id) => {
    setOpen(true);
    setEditP(_id);
    try {
      const res = await fetchDataFromApi(`/api/products/${_id}`);
      if (res) {
        setFormFields({
          name: res.name,
          description: res.description,
          images: res.images || [], // Set an empty array if images are undefined
          brand: res.brand || '',
          price: res.price || '',
          oldPrice: res.oldPrice || '',
          category: res.category ? res.category.name : '', // assuming res.category is an object
          countInStock: res.countInStock || '',
          isFeatured: res.isFeatured || false,
        });
      }
    } catch (error) {
      console.error('Error fetching product data for edit:', error);
    }
  };

  const editPFun = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editData(`/api/products/${EditP}`, {
        name: formFields.name,
        description: formFields.description,
        images: formFields.images, // Assuming images is an array of URLs
        brand: formFields.brand,
        price: formFields.price,
        oldPrice: formFields.oldPrice,
        category: formFields.category,
        countInStock: formFields.countInStock,
        isFeatured: formFields.isFeatured,
      });
      await fetchProducts(); // Refresh product list after editing
      handleClose(); // Close the dialog after saving
    } catch (error) {
      console.error('Failed to edit product:', error);
    } finally {
      setLoading(false); // Stop loading spinner
      context.setAlertBox({
        error: false,
        msg: 'Product edited successfully',
        open: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteData(`/api/products/${deleteID}`);
      fetchProducts();
      handleCloseDeleteDialog();
      context.setAlertBox({
        error: false,
        msg: 'Product deleted successfully',
        open: true,
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      context.setAlertBox({
        error: true,
        msg: 'Error deleting product',
        open: true,
      });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-8">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox
              color={['#1da256', '#48d483']}
              icon={<FaRegUserCircle />}
              grow={true}
            />
            <DashboardBox
              color={['#c012e2', '#eb64fe']}
              icon={<FaCartShopping />}
            />
            <DashboardBox
              color={['#2c78e5', '#60aff5']}
              icon={<FaBagShopping />}
            />
            <DashboardBox
              color={['#e1950e', '#f3cd29']}
              icon={<GiStarsStack />}
            />
          </div>
        </div>
        <div className="col-md-4 pl-0">
          <div className="box graphBox">
            <div className="d-flex align-items-center w-100 mt-5 bottomElm">
              <h4 className="text-white mb-0 mt-0">Total Sales</h4>
              <Button
                className="ml-auto toggleIcon"
                aria-label="more"
                id="long-button"
                aria-controls={opens ? 'long-menu' : undefined}
                aria-expanded={opens ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <HiDotsVertical />
              </Button>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={opens}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 5.0,
                      width: '35ch',
                    },
                  },
                }}
              >
                <MenuItem onClick={handleClose}>
                  <IoTimerOutline />
                  Last Day
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <IoTimerOutline />
                  Last Week
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <IoTimerOutline />
                  Last Month
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <IoTimerOutline />
                  Last Year
                </MenuItem>
              </Menu>
            </div>
            <h3 className="text-white font-weight-bold">#3,123,23,235.00</h3>
            <p className="text-white">$3,567,32.0 in last month</p>
            <Chart
              chartType="PieChart"
              data={data}
              options={options}
              width={'100%'}
              height={'220px'}
            />
          </div>
        </div>
      </div>
      <div className="card shadow border-0 p-3 mt-4 w-100">
        <h3 className="hd">Best Selling Products</h3>
        <div className="row cardFilter mt-4">
          <div className="col-md-3">
            <h4>SHOW BY</h4>
            <Select
              value={showBy}
              onChange={(e) => setShowBy(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className="w-100"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="col-md-3">
            <h4>CATEGORY BY</h4>
            <Select
              value={showCat}
              onChange={(e) => setShowCat(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className="w-100"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="col-md-3">
            <h4>BRAND BY</h4>
            <Select
              value={showBrand}
              onChange={(e) => setshowBrand(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className="w-100"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="col-md-3">
            <h4>SEARCH BY</h4>
            <Select
              value={showSearch}
              onChange={(e) => setshowSearch(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className="w-100"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
        </div>
        <ProductsTable
          productList={productList}
          context={context}
          loading={loading}
          handleEditP={handleEditP}
          handleOpenDeleteDialog={handleOpenDeleteDialog}
          isHomePage={false}
        />
      </div>
    </div>
  );
};

export default Home;
