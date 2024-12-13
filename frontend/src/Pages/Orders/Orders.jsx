import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(
        `/api/orders?userId=${user.userId}&page=1&perPage=8`
      ).then((res) => {
        setOrders(res);
      });
    }
    console.log("Fetching orders for user ID:", user.userId);
  }, []);

  const handchangePage = (value) => {
    const user = JSON.parse(localStorage.getItem("user"));
    setPage(value);
    fetchDataFromApi(
      `/api/orders?userId=${user.userId}&page=${value}&perPage=8`
    ).then((res) => {
      setOrders(res);
    });
    console.log("Fetching orders for user ID:", user.userId);
  };

  const showProductOrder = (id) => {
    fetchDataFromApi(`/api/orders/${id}`).then((res) => {
      setOpen(true);
      setProductOrders(res.products);
    });
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <h2 className="hd">Orders</h2>
          <div className="table-responsive order-table">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Payment Id</th>
                  <th>Sản phẩm</th>
                  <th>Người nhận</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Mã code</th>
                  <th>Tổng tiền</th>
                  <th>Email</th>
                  <th>User Id</th>
                  <th>Order status</th>
                  <th>Ngày mua</th>
                </tr>
              </thead>
              <tbody>
                {orders?.data?.map((item, index) => (
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
                      {item?.status === "Chờ xác nhận" ? (
                        <span className="badge badge-danger">
                          {item?.status}
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          {item?.status}
                        </span>
                      )}
                    </td>
                    <td>{item?.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Chi tiết sản phẩm bạn mua
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                  position: "absolute",
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
                        <th>Id Sản phẩm</th>
                        <th>Tên Sản phẩm</th>
                        <th>Ảnh Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá lẻ / cái</th>
                        <th>Tổng tiền thanh toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productOrders?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.productId}</td>
                          <td>{item?.productTitle?.substr(0, 30) + "..."}</td>
                          <td>
                            <div className="img">
                              <img src={item?.image} alt="" />
                            </div>
                          </td>
                          <td>{item?.quantity}</td>
                          <td>{item?.price}</td>
                          <td>{item?.subTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </BootstrapDialog>
          </div>
          {orders?.data?.totalPages > 1 && (
            <div className="d-flex tableFooter">
              <Pagination
                count={orders?.data?.totalPages}
                showFirstButton
                showLastButton
                onClick={(event, value) => handchangePage(value)}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default Orders;
