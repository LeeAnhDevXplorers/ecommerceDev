import React, { useContext, useRef, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './ProductZoom.css';
const ProductZoom = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  const goto = (index) => {
    setSlideIndex(index);
    zoomSlider.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };

  return (
    <div className="productZoom">
      <div className="productZoom position-relative">
        <div className="badge badge-primary">{props.discount}%</div>
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          navigation={false}
          slidesPerGroup={1}
          modules={[Navigation]}
          className="zoomSliderBig"
          ref={zoomSliderBig}
        >
          {props?.images?.map((img, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="item">
                  <InnerImageZoom zoomType="hover" zoomScale={1} src={img} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        navigation={true}
        slidesPerGroup={1}
        modules={[Navigation]}
        className="zoomSlider"
        ref={zoomSlider}
      >
        {props?.images?.map((img, index) => {
          return (
            <SwiperSlide key={index}>
              <div className={`item ${slideIndex === 0 && 'item_active'}`}>
                <img
                  className="w-100"
                  onClick={() => goto(index)}
                  src={img}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProductZoom;