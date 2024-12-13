import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { height } from "@mui/system";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import Header from "./Components/Header/Header";
import SideBar from "./Components/SideBar/SideBar";
import Category from "./Pages/Category/Category";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
// import ProductDetails from './Pages/Products/ProductDetails';
import Products from "./Pages/Products/Products";
// import ProductUpload from './Pages/Products/ProductUpload';
import axios from "axios";
import CategoryAdd from "./Pages/Category/AddCategory/CategoryAdd";
import AddSubcat from "./Pages/Category/AddSubcat/AddSubcat";
import SubCategory from "./Pages/Category/SubCategory";
import Orders from "./Pages/Orders/Orders";
import ProductDetails from "./Pages/Products/ProductDetails";
import ProductRams from "./Pages/Products/ProductRams";
import ProductUpload from "./Pages/Products/ProductUpload";
import SignUp from "./Pages/SignUp/SignUp";

const MyContext = createContext();
const App = () => {
  const [countryList, setCountruList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const [baseUrl, setBaseUrl] = useState("http://localhost:4000");
  const [progress, setProgress] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });
  const [isToggleSiderBar, setisToggleSiderBar] = useState(false);
  const [isHide, setisHide] = useState(true);
  const [themeMode, setThemeMode] = useState(true);
  const values = {
    isToggleSiderBar,
    setisToggleSiderBar,
    isHide,
    setisHide,
    themeMode,
    setThemeMode,
    alertBox,
    setAlertBox,
    progress,
    setProgress,
    baseUrl,
    setBaseUrl,
    user,
    setUser,
    isLogin,
    setIsLogin,
    countryList,
    setCountruList,
    setSelectedCountry,
    selectedCountry,
  };
  useEffect(() => {
    if (themeMode === true) {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("themeMode", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    }
  }, [themeMode]);

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountruList(res.data.data);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null && token !== "" && token !== undefined) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);
  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  return (
    <div>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <LoadingBar
            color="#1a73e8"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
            style={{ height: "5px" }}
          />
          <Snackbar
            open={alertBox.open}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={alertBox.error === false ? "success" : "error"}
              variant="filled"
              sx={{ fontSize: "1.4rem" }}
            >
              {alertBox.msg}
            </Alert>
          </Snackbar>
          {isHide === true && <Header />}

          <div className="main d-flex">
            {isHide === true && (
              <div
                className={`sidebarWrapper ${
                  isToggleSiderBar === true ? "toggle" : ""
                }`}
              >
                <SideBar />
              </div>
            )}
            <div
              className={`${isAuthPage ? "auth-page" : "content"} ${
                isToggleSiderBar ? "toggle" : ""
              }`}
            >
              <Routes>
                <Route path="/" exact={true} element={<Home />} />
                <Route path="/login" exact={true} element={<Login />} />
                <Route path="/signup" exact={true} element={<SignUp />} />
                <Route
                  path="product/producDetails/:id"
                  exact={true}
                  element={<ProductDetails />}
                />
                <Route
                  path="/product/productlist"
                  exact={true}
                  element={<Products />}
                />
                <Route
                  path="/product/productupload"
                  exact={true}
                  element={<ProductUpload />}
                />
                <Route
                  path="/category/categoryadd"
                  exact={true}
                  element={<CategoryAdd />}
                />
                <Route
                  path="/category/categorylist"
                  exact={true}
                  element={<Category />}
                />
                <Route
                  path="/category/addsubcat"
                  exact={true}
                  element={<AddSubcat />}
                />
                <Route
                  path="/category/subcategory"
                  exact={true}
                  element={<SubCategory />}
                />
                <Route
                  path="/product/productrams"
                  exact={true}
                  element={<ProductRams />}
                />
                <Route
                  path="/product/productrams"
                  exact={true}
                  element={<ProductRams />}
                />
                <Route
                  path="/product/orders"
                  exact={true}
                  element={<Orders />}
                />
              </Routes>
            </div>
          </div>
        </MyContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
export { MyContext };
