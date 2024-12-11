import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useContext, useState } from 'react';
import { CiLight } from 'react-icons/ci';
import { FaBell } from 'react-icons/fa';
import { IoShieldHalf } from 'react-icons/io5';
import { MdDarkMode, MdEmail, MdShoppingCart } from 'react-icons/md';
import { RiMenuUnfold3Line2, RiMenuUnfold4Line2 } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { assets } from '../../assets/assets';
import SearchBox from '../SearchBox/SearchBox';
import UserAvataComponent from '../userAvataComponent/userAvataComponent';
import './Header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenNotifyDrop, setisOpenNotifyDrop] = useState(null);
  const openMyacc = Boolean(anchorEl);
  const openNotify = Boolean(isOpenNotifyDrop);
  const context = useContext(MyContext);
  const navigate = useNavigate()
  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNotifyDrop = (event) => {
    setisOpenNotifyDrop(event.currentTarget);
  };

  const handleClMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleClNotifyDrop = () => {
    setisOpenNotifyDrop(null);
  };

  const logout = () => {
    localStorage.clear();
    setAnchorEl(null)
    setTimeout(() => {
      navigate("/login")
    }, 1000);
  };

  return (
    <header className="d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="row d-flex align-items-center w-100">
          <div className="col-sm-2 part1">
            <Link to={'/'} className="d-flex align-items-center logo">
              <img src={assets.logo} alt="Great Stack Logo" />
              <span className="ml-2">Great Stack</span>
            </Link>
          </div>
          <div className="col-xs-3 d-flex align-items-center part2 pl-4">
            <Button
              className="rounded-circle mr-3"
              onClick={() =>
                context.setisToggleSiderBar(!context.isToggleSiderBar)
              }
            >
              {context.isToggleSiderBar === false ? (
                <RiMenuUnfold4Line2 />
              ) : (
                <RiMenuUnfold3Line2 />
              )}
            </Button>
            <SearchBox />
          </div>
          <div className="col-sm-7 d-flex align-items-center justify-content-end part3 ml-auto">
            <Button
              className="rounded-circle mr-3"
              onClick={() => context.setThemeMode(!context.themeMode)}
            >
              <CiLight />
            </Button>
            <Button className="rounded-circle mr-3">
              <MdDarkMode />
            </Button>
            <Button className="rounded-circle mr-3">
              <MdShoppingCart />
            </Button>
            <Button className="rounded-circle mr-3">
              <MdEmail />
            </Button>
            <div className="dropdowWrapper posotion-relative">
              <Button
                className="rounded-circle mr-3"
                onClick={handleOpenNotifyDrop}
              >
                <FaBell />
              </Button>
              <Menu
                sx={{ marginTop: '22px' }}
                anchorEl={isOpenNotifyDrop}
                className="dropdow_list-notify"
                id="notifications"
                open={openNotify}
                onClose={handleClNotifyDrop}
                onClick={handleClNotifyDrop}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <div className="head p-3">
                  <h4>Orders (12)</h4>
                </div>
                <Divider className="" />
                <div className="srcoll">
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <UserAvataComponent />
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1 mt-0" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                  <Divider className="mb-1" />
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClNotifyDrop}
                  >
                    <div className="d-flex">
                      <div className="userImg">
                        <span className="rounded-circle">
                          <img
                            src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                            alt="User Avatar"
                          />
                        </span>
                      </div>
                      <div className="dropdowInfo">
                        <h4>
                          <span>
                            <b>Anh</b>
                            đã thêm vào danh sách yêu thích của anh ấy
                            <b> Quần âu dáng suông</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">Vài giây trước</p>
                      </div>
                    </div>
                  </MenuItem>
                </div>
                <div className="pl-3 pr-3 w-100 pb-2 pt-2">
                  <Button className="btn-blue w-100">Xem tất cả</Button>
                </div>
              </Menu>
            </div>

            {context.isLogin !== true ? (
              <Button className="btn-blue btn-lg btn-round text-white">
                <Link to={'/login'}>Sign In</Link>
              </Button>
            ) : (
              <div className="myAccWrapper">
                <Button
                  className="myAcc d-flex align-items-center"
                  onClick={handleOpenMyAccDrop}
                >
                  <div className="userImg">
                    <span className="rounded-circle">
                      {context.user?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="userInfo">
                    <h4>{context.user?.name}</h4>
                    <p className="mb-0">{context.user?.email}</p>
                  </div>
                </Button>
                <Menu
                  sx={{ marginTop: '15px' }}
                  anchorEl={anchorEl}
                  className="dropdow_list"
                  id="account-menu"
                  open={openMyacc}
                  onClose={handleClMyAccDrop}
                  onClick={handleClMyAccDrop}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClMyAccDrop}
                  >
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    My Account
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: '1.5rem' }}
                    onClick={handleClMyAccDrop}
                  >
                    <ListItemIcon>
                      <IoShieldHalf fontSize="small" />
                    </ListItemIcon>
                    Reset Password
                  </MenuItem>
                  <MenuItem sx={{ fontSize: '1.5rem' }} onClick={logout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
