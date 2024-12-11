import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import { Breadcrumbs, Button, Chip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import { emphasize, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
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
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [productOrders, setProductOrders] = useState([]);
  const [page, setPage] = useState(1);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    fetchDataFromApi(`/api/orders?page=1&perPage=8`).then((res) => {
      setOrders(res);
    });
  }, []);

  const handchangePage = (value) => {
    setPage(value);
    fetchDataFromApi(`/api/orders?page=${value}&perPage=8`).then((res) => {
      setOrders(res);
    });
  };

  const showProductOrder = (id) => {
    fetchDataFromApi(`/api/orders/${id}`).then((res) => {
      setOpen(true);
      setProductOrders(res.products);
    });
  };
  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 p-3 mt-4 w-100">
        {/* Header */}
        <div className="MuiBox-root css-99a237 d-flex">
          <h6 className="MuiTypography-root MuiTypography-h6 css-66yapz-MuiTypography-root">
            Orders
          </h6>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyleBreadcrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyleBreadcrumb
              href="#"
              label="Order"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>
      </div>
      <div className="table-responsive w-100 mt-5 table-responsive order-table">
        <table className=" table-bordered v-align table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Order Id</th>
              <th>Paymant Id</th>
              <th>Sản phẩm</th>
              <th>Người nhận</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Mã code</th>
              <th>Tổng tiền</th>
              <th>Email</th>
              <th>Urser Id</th>
              <th>Order status</th>
              <th>Ngày mua</th>
            </tr>
          </thead>
          <tbody>
            {orders?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item?._id}</td>
                  <td>{item?.paymentId}</td>
                  <td>
                    <span onClick={() => showProductOrder(item?._id)}>
                      Click here to view
                    </span>
                  </td>
                  <td>{item?.name}</td>
                  <td>{item?.phoneNumber}</td>
                  <td>{item?.address}</td>
                  <td>{item?.pincode}</td>
                  <td>{item?.amount}</td>
                  <td>{item?.email}</td>
                  <td>{item?.userId}</td>
                  <td>
                    {item?.status === 'Chờ xác nhận' ? (
                      <span className="badge badge-danger">{item?.status}</span>
                    ) : (
                      <span className="badge badge-success">
                        {item?.status}
                      </span>
                    )}
                  </td>
                  <td>{item?.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Chi tiết sản phẩm bạn mua
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <div className="table-responsive order-table">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Id Sản phẩm</th>
                    <th>Tên Sản phẩm</th>
                    <th>Ảnh Sản phẩm</th>
                    <th>Số lượng </th>
                    <th>Giá lẻ / cái</th>
                    <th>Tổng tiền thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {productOrders?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item?.productId}</td>
                        <td>{item?.productTitle?.substr(0, 30) + '...'}</td>
                        <td>
                          <div className="img">
                            <img src={item?.image} alt="" />
                          </div>
                        </td>
                        <td>{item?.quantity}</td>
                        <td>{item?.price}</td>
                        <td>{item?.subTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </BootstrapDialog>
      </div>
    </div>
  );
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export default Orders;
