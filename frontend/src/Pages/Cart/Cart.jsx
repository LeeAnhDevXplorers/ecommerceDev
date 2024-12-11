import { Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import { loadStripe } from '@stripe/stripe-js';
import React, { useContext, useEffect, useState } from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import { MdDeleteForever } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import QuantityBox from '../../Components/QuantityBox/QuantityBox';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import './Cart.css';
const Cart = () => {
  const context = useContext(MyContext);
  const [cartData, setCartData] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [productQuantity, setProductQuantity] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState();
  let [cartFields, setCartFields] = useState({});
  const [changeQuantity, setChangeQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const quantity = (val) => {
    setProductQuantity(val);
    setChangeQuantity(val);
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/${id}`).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'Xóa sản phẩm thành công',
      });
      fetchDataFromApi(`/api/cart`).then(setCartData);
      context.getCartData();
    });
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
      setSelectedQuantity(res?.quantity);
    });
  }, []);

  function selectItem(item, quantityVal) {
    if (changeQuantity !== 0) {
      if (!item || !quantityVal) {
        console.error('Invalid item or quantity');
        return;
      }

      setIsLoading(true);

      const user = JSON.parse(localStorage.getItem('user')) || {};
      const cartFields = {
        productTitle: item?.productTitle || '',
        image: item?.image || '',
        rating: item?.rating || 0,
        price: item?.price || 0,
        quantity: quantityVal || 0,
        subTotal: parseInt(item?.price * quantityVal) || 0,
        productId: item?.productId || '',
        userId: user?.userId || '',
      };

      editData(`/api/cart/${item?._id}`, cartFields)
        .then((res) => {
          setIsLoading(false);
          fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then(
            setCartData
          );
        })
        .catch((error) => {
          console.error('Error updating cart:', error);
          setIsLoading(false);
        });
    }
  }

  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-9 pr-5">
              <h2 className="hd mb-2 mt-2">Giỏ hàng của bạn</h2>
              <p className="mb-4">
                Có <b className="text-red">{cartData?.length}</b> sản phẩm trong
                giỏ hàng của bạn
              </p>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="45%">Sản phẩm</th>
                      <th width="10%">Giá</th>
                      <th width="20%">Số lượng</th>
                      <th width="15%">Tổng tiền</th>
                      <th width="10%">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td width="45%">
                            <Link to={`/product/${item?.productId}`}>
                              <div className="d-flex align-items-center cartItemImgWrapper">
                                <div className="imgWrapper">
                                  <img
                                    src={item?.image}
                                    alt={item?.productTitle}
                                    className="w-100"
                                  />
                                </div>
                                <div className="info px-3 ml-4">
                                  <h6>
                                    {item?.productTitle?.substr(0, 50) + '...'}
                                  </h6>
                                  <Rating
                                    name="read-only"
                                    value={item?.rating}
                                    readOnly
                                    size="large"
                                  />
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td width="15%">${item?.price}</td>
                          <td width="20%">
                            <QuantityBox
                              quantity={quantity}
                              item={item}
                              selectItem={selectItem}
                              value={item?.quantity}
                            />
                          </td>
                          <td width="15%">${item?.subTotal}</td>
                          <td width="10%">
                            <span
                              className="remove cursor"
                              onClick={() => removeItem(item?._id)}
                            >
                              <MdDeleteForever />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border p-3 cartDetails">
                <h4>CART TOTALS</h4>
                <div className="d-flex align-items-center mb-3">
                  <span>Subtotal</span>
                  <span className="ml-auto text-red font-weight-bold">
                    $
                    {cartData
                      .map((item) => parseInt(item.price) * item.quantity)
                      .reduce((total, value) => total + value, 0)}
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Shipping</span>
                  <span className="ml-auto">
                    <b>Free</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Estimate for</span>
                  <span className="ml-auto">
                    <b>Viet Nam</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Total</span>
                  <span className="ml-auto text-red font-weight-bold">
                    $
                    {cartData
                      .map((item) => parseInt(item.price) * item.quantity)
                      .reduce((total, value) => total + value, 0)}
                  </span>
                </div>
                <br />
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <Link to="/checkout">
                    <Button
                      className="cart-btn btn-blue btn-big btn-round"
                      onClick={handleClick}
                    >
                      <IoBagCheckOutline />
                      Thanh Toán
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isLoading === true && <div className="loading"></div>}
    </>
  );
};

export default Cart;
