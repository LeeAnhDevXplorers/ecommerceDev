import Button from '@mui/material/Button';
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import { FaArrowRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductItem from '../../../Components/ProductItem/ProductItem';
import './Relatedproducts.css';
const Relatedproducts = (props) => {
  return (
    <>
      <div className="d-flex align-items-center mt-4">
        <div className="info w-75">
          <h3 className="mb-0 hd">{props.title}</h3>
        </div>
      </div>
      <div className="product-row mt-4 w-100">
        <Swiper
          slidesPerView={4}
          spaceBetween={0}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {props?.data?.length !== 0 &&
            props?.data?.map((item, index) => {
              return (
                <SwiperSlide className="mr-2" key={index}>
                  <ProductItem item={item} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </>
  );
};

export default Relatedproducts;
