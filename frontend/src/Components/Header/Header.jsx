import FactCheckIcon from '@mui/icons-material/FactCheck';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Logout from '@mui/icons-material/Logout';
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material/';
import Button from '@mui/material/Button';
import React, { useContext } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoBagHandleOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { assets } from '../../assets/assets';
import CountryDrop from '../CountryDrop/CountryDrop';
import './Header.css';
import Navigation from './Navigation/Navigation';
import SearchBox from './SearchBox/SearchBox';
const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    localStorage.clear();
    setAnchorEl(null);
    context.setisLogin(false);
  };

  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip bg">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              <b>e-Commerce Shop</b> Bảo vệ bạn từ khâu thanh toán đến khâu giao
              hàng bằng
            </p>
          </div>
        </div>
        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper col-sm-2 d-flex align-items-center">
                <Link to={'/'}>
                  <img src={assets.logo} alt="" />
                </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">
                {context.countryList.length !== 0 && <CountryDrop />}

                <SearchBox />
                <div className="d-flex align-items-center part3 ml-auto">
                  {context.isLogin !== true ? (
                    <Link to={'/SignIn'}>
                      <Button className="btn-blue btnlg btn-big btn-round mr-4">
                        Sign In
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button className="circle mr-3" onClick={handleClick}>
                        <FaRegUser />
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter:
                                'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{
                          horizontal: 'right',
                          vertical: 'top',
                        }}
                        anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'bottom',
                        }}
                      >
                        <Link to="/my-account">
                        <MenuItem
                          onClick={handleClose}
                          sx={{ fontSize: '1.6rem' }}
                        >
                          <Avatar /> My account
                        </MenuItem>
                        </Link>
                        <Divider />
                        <Link to="/orders">
                          <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                              <FactCheckIcon fontSize="large" />
                            </ListItemIcon>
                            Orders
                          </MenuItem>
                        </Link>
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <FavoriteIcon fontSize="large" />
                          </ListItemIcon>
                          My List
                        </MenuItem>
                        <MenuItem onClick={logout}>
                          <ListItemIcon>
                            <Logout fontSize="large" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  )}

                  {/*  */}
                  <div className="ml-auto cartTab d-flex align-items-center">
                    <span className="price">
                      $
                      {context.cartData
                        ?.map((item) => parseInt(item.price) * item.quantity)
                        .reduce((total, value) => total + value, 0)}
                    </span>
                    <div className="position-relative d-flex align-items-center ml-2">
                      <Button className="circle">
                        <Link to={'/cart'}>
                          {' '}
                          <IoBagHandleOutline />
                        </Link>
                      </Button>
                      <span className="count d-flex align-items-center justify-content-center">
                        {context.cartData?.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {context.catData?.length !== 0 && (
          <Navigation navData={context.catData} />
        )}
      </div>
    </>
  );
};

export default Header;
