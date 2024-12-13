import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import ProductModal from './Components/ProductModal/ProductModal';
import Cart from './Pages/Cart/Cart';
import Checkout from './Pages/Checkout/Checkout';
import Home from './Pages/Home/Home';
import Listing from './Pages/Listing/Listing';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import { fetchDataFromApi, postData } from './utils/api';
import Orders from './Pages/Orders/Orders';
import Search from './Pages/Listing/Listing';
import MyAccount from './Pages/MyAccount/MyAccount';

const MyContext = createContext();

const App = () => {
  const [countryList, setCountruList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchData, setSearchData] = useState([])
  const [isOpenProductModal, setisOpenProductModal] = useState({
    id: '',
    open: false,
  });
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false,
  }); 
  const [user, setUser] = useState({
    name: '',
    email: '',
    userId: '',
  });
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [productData, setProducutsData] = useState();
  const [isLogin, setisLogin] = useState(false);
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [addingInCart, setAddingInCart] = useState(false);
  const [cartData, setCartData] = useState();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getCountry('https://countriesnow.space/api/v0.1/countries/');
    fetchDataFromApi(`/api/category`).then((res) => {
      setCatData(res.categoryList);
      setActiveCat(res.categoryList[0]?.name);
    });
    fetchDataFromApi('/api/subCategory').then((res) => {
      setSubCatData(res.data);
    });
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
    });
  }, []);

  const getCartData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
    });
  };

  useEffect(() => {
    isOpenProductModal.open === true &&
      fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
        setProducutsData(res);
      });
  }, [isOpenProductModal]);

  const addtoCart = (data) => {
    setAddingInCart(true);
    postData(`/api/cart/add`, data)
      .then((res) => {
        if (res && res.status !== false) {
          setAlertBox({
            open: true,
            error: false,
            msg: 'Bạn đã thêm vào giỏ hàng',
          });
          setTimeout(() => {
            setAddingInCart(false);
          }, 2000);
          getCartData();
        } else {
          setAlertBox({
            open: true,
            error: true,
            msg: res?.msg || 'Đã có lỗi xảy ra!',
          });
          setAddingInCart(false);
        }
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
        setAlertBox({
          open: true,
          error: true,
          msg: 'Lỗi kết nối hoặc máy chủ không phản hồi.',
        });
        setAddingInCart(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null && token !== '' && token !== undefined) {
      setisLogin(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    } else {
      setisLogin(false);
    }
  }, [isLogin]);

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountruList(res.data.data);
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox({
      open: false,
    });
  };
  const values = {
    countryList,
    setSelectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setisLogin,
    catData,
    setCatData,
    alertBox,
    setAlertBox,
    subCatData,
    setSubCatData,
    activeCat,
    setActiveCat,
    addtoCart,
    addingInCart,
    setAddingInCart,
    cartData,
    setCartData,
    getCartData,
    searchData,
    setSearchData
  };
  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Snackbar
          open={alertBox.open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ fontSize: "1.4rem", width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>
        {isHeaderFooterShow === true && <Header />}

        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/subCat/:id" exact={true} element={<Listing />} />
          <Route path="/cat/:id" exact={true} element={<Listing />} />
          <Route
            path="/product/:id"
            exact={true}
            element={<ProductDetails />}
          />
          <Route path="/cart" exact={true} element={<Cart />} />
          <Route path="/signIn" exact={true} element={<SignIn />} />
          <Route path="/signUp" exact={true} element={<SignUp />} />
          <Route path="/checkout" exact={true} element={<Checkout />} />
          <Route path="/orders" exact={true} element={<Orders />} />
          <Route path="/search" exact={true} element={<Search />} />
          <Route path="/my-account" exact={true} element={<MyAccount />} />
        </Routes>
        {isHeaderFooterShow === true && <Footer />}

        {isOpenProductModal.open === true && (
          <ProductModal data={productData} />
        )}
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;
export { MyContext };
