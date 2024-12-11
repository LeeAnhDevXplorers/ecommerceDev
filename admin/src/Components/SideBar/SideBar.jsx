import FactCheckIcon from '@mui/icons-material/FactCheck';
import { Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaAngleRight } from 'react-icons/fa';
import { FaProductHunt } from 'react-icons/fa6';
import { HiOutlineLogout } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import './SideBar.css';

const SideBar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();
  const handleTabClick = (index) => {
    if (activeTab === index) {
      setIsToggleSubmenu(!isToggleSubmenu);
    } else {
      setActiveTab(index);
      setIsToggleSubmenu(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null && token !== '' && token !== undefined) {
      setIsLogin(true);
    } else {
      history('/login');
    }
  }, []);

  return (
    <div className="sideBar">
      <ul>
        <li>
          <Link to={'/'}>
            <Button
              className={`w-100 ${activeTab === 0 ? 'act' : ''}`}
              onClick={() => handleTabClick(0)}
            >
              <span className="icon">
                <BiSolidDashboard />
              </span>
              Dashboard
              <span className="arrow"></span>
            </Button>
          </Link>
        </li>
        <li>
          <Button
            className={`w-100 ${activeTab === 1 ? 'act' : ''}`}
            onClick={() => handleTabClick(1)}
          >
            <span className="icon">
              <FaProductHunt />
            </span>
            Sản phẩm
            <span className="arrow">
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${
              activeTab === 1 && isToggleSubmenu ? 'colapse' : 'colapsed'
            }`}
          >
            <ul className="submenu">
              <li>
                <Link to={'/product/productlist'}>Danh sách sản phẩm</Link>
              </li>
              <li>
                <Link to={'/product/producDetails'}>Xem sản phẩm</Link>
              </li>
              <li>
                <Link to={'/product/productupload'}>Tải lên sản phẩm</Link>
              </li>
              <li>
                <Link to={'/product/productrams'}>Tải lên Ram</Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <Button
            className={`w-100 ${activeTab === 2 ? 'act' : ''}`}
            onClick={() => handleTabClick(2)}
          >
            <span className="icon">
              <FaProductHunt />
            </span>
            Danh mục sản phẩm
            <span className="arrow">
              <FaAngleRight />
            </span>
          </Button>
          <div
            className={`submenuWrapper ${
              activeTab === 2 && isToggleSubmenu ? 'colapse' : 'colapsed'
            }`}
          >
            <ul className="submenu">
              <li>
                <Link to={'/category/categorylist'}>Danh mục sản phẩm</Link>
              </li>
              <li>
                <Link to={'/category/subcategory'}>Danh sách Danh mục con</Link>
              </li>
              <li>
                <Link to={'/category/categoryadd'}>Tải lên Danh mục</Link>
              </li>
              <li>
                <Link to={'/category/addsubcat'}>Tải lên Danh mục con</Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <Link to={'/product/orders'}>
            <Button
              className={`w-100 ${activeTab === 4 ? 'act' : ''}`}
              onClick={() => handleTabClick(4)}
            >
              <span className="icon">
                <FactCheckIcon fontSize="large" />
              </span>
              Orders
              <span className="arrow"></span>
            </Button>
          </Link>
        </li>
      </ul>
      <br />
      <hr />
      <div className="logoutWrapper">
        <div className="logoutBox">
          <Button variant="contained">
            <HiOutlineLogout /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
