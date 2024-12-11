import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import css files
import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { assets } from '../../assets/assets';
import './HomeBanner.css';
// import Slider from "react-slick/lib/slider";
const HomeBanner = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: false,
    autoplay: true,
  };
  return (
    <div className="homeBannerSection mt-2">
      <Slider {...settings}>
        <div className="item">
          <img className="w-100" src={assets.banner_1} alt="" />
        </div>
        <div className="item">
          <img className="w-100" src={assets.banner_2} alt="" />
        </div>
        <div className="item">
          <img className="w-100" src={assets.banner_3} alt="" />
        </div>
        <div className="item">
          <img className="w-100" src={assets.banner_4} alt="" />
        </div>
        <div className="item">
          <img className="w-100" src={assets.banner_5} alt="" />
        </div>
        <div className="item">
          <img className="w-100" src={assets.banner_6} alt="" />
        </div>
      </Slider>
      {/* <Swiper
          slidesPerView={1}
          spaceBetween={15}
          navigation={true}
          loop={false}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="item">
              <img className="w-100" src={assets.banner_1} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <img className="w-100" src={assets.banner_2} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <img className="w-100" src={assets.banner_3} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <img className="w-100" src={assets.banner_4} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <img className="w-100" src={assets.banner_5} alt="" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="item">
              <img className="w-100" src={assets.banner_6} alt="" />
            </div>
          </SwiperSlide>
        </Swiper> */}
    </div>
  );
};

export default HomeBanner;
