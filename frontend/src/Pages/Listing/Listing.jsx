import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { GrMenu } from 'react-icons/gr';
import { HiViewGrid } from 'react-icons/hi';
import { TbGridDots } from 'react-icons/tb';
import { TfiAngleDown, TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { useParams } from 'react-router-dom';
import ProductItem from '../../Components/ProductItem/ProductItem';
import SideBar from '../../Components/SideBar/SideBar';
import { assets } from '../../assets/assets';
import { fetchDataFromApi } from '../../utils/api';
import './Listing.css';
const Listing = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]);
  const [productView, setProductView] = useState('four');
  const open = Boolean(anchorEl);
  const handleClick = (even) => {
    setAnchorEl(even.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { id } = useParams();
  useEffect(() => {
    fetchDataFromApi(`/api/products?subName=${id}`).then((res) => {
      setProductData(res.data);
    });
  }, [id]);

  const filterData = (subName) => {
    fetchDataFromApi(`/api/products?subName=${subName}`).then((res) => {
      setProductData(res.data);
    });
  };

  const filterByPrice = (price, subName) => {
    fetchDataFromApi(
      `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subName=${subName}`
    ).then((res) => {
      setProductData(res.data);
    });
  };

  const filterByRating = (rating, subName) => {
    fetchDataFromApi(`/api/products?rating=${rating}&subName=${subName}`).then(
      (res) => {
        setProductData(res.data);
      }
    );
  };

  return (
    <>
      <section className="product_Listing_Page">
        <div className="container">
          <div className="productListing d-flex">
            <SideBar
              filterData={filterData}
              filterByPrice={filterByPrice}
              filterByRating={filterByRating}
            />
            <div className="content_right">
              <img
                className="w-100"
                src={assets.banner3}
                style={{ borderRadius: '8px' }}
                alt=""
              />
              <div className="showBy mt-3 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button
                    className={productView === 'one' && 'atc'}
                    onClick={() => setProductView('one')}
                  >
                    <GrMenu />
                  </Button>
                  <Button
                    className={productView === 'two' && 'atc'}
                    onClick={() => setProductView('two')}
                  >
                    <HiViewGrid />
                  </Button>
                  <Button
                    className={productView === 'three' && 'atc'}
                    onClick={() => setProductView('three')}
                  >
                    <TbGridDots />
                  </Button>
                  <Button
                    className={productView === 'four' && 'atc'}
                    onClick={() => setProductView('four')}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>
                <div className="ml-auto showByFilter">
                  <Button onClick={handleClick}>
                    Show 9 <TfiAngleDown />
                  </Button>
                  <Menu
                    className="w-100 showPerDrop"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>10</MenuItem>
                    <MenuItem onClick={handleClose}>30</MenuItem>
                    <MenuItem onClick={handleClose}>50</MenuItem>
                    <MenuItem onClick={handleClose}>70</MenuItem>
                  </Menu>
                </div>
              </div>

              <div className="productListings">
                {productData?.map((item, index) => {
                  return (
                    <ProductItem
                      key={index}
                      itemView={productView}
                      item={item}
                    />
                  );
                })}
              </div>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination count={10} color="primary" size="large" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
