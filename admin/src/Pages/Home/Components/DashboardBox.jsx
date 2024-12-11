import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  HiDotsVertical,
  HiOutlineTrendingDown,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import { IoTimerOutline } from 'react-icons/io5';
import './DashboardBox.css';

const ITEM_HEIGHT = 48; // Adjust based on your menu item height

const DashboardBox = ({ color, grow, icon }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className="dashboardBox"
      style={{
        backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
      }}
    >
      <span className="chart">
        {grow ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />}
      </span>
      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0">Total Users</h4>
          <span className="text-white">277</span>
        </div>
        <div className="ml-auto">
          {icon && <span className="icon">{icon}</span>}
        </div>
      </div>
      <div className="d-flex align-items-center w-100 mt-5 bottomElm">
        <h5 className="text-white mb-0 mt-0">Last month</h5>
        <Button
          className="ml-auto toggleIcon"
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
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
          open={open}
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
    </div>
  );
};

DashboardBox.propTypes = {
  color: PropTypes.arrayOf(PropTypes.string),
  grow: PropTypes.bool,
  icon: PropTypes.node,
};

export default DashboardBox;
