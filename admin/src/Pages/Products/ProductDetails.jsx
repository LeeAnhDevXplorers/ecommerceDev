import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import { Breadcrumbs, Chip } from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
// core version + navigation, pagination modules:
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { BiCategoryAlt } from 'react-icons/bi';
import { BsFileEarmarkRuledFill } from 'react-icons/bs';
import { FaStore } from 'react-icons/fa';
import { FaReply } from 'react-icons/fa6';
import { ImPriceTags } from 'react-icons/im';
import { IoIosCart, IoIosColorPalette } from 'react-icons/io';
import { IoSettingsOutline, IoStarHalf } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import UserAvataComponent from '../../Components/userAvataComponent/userAvataComponent';
import { fetchDataFromApi } from '../../utils/api';
import './ProductDetails.css';

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1], // Fixed 'theme.shadow' to 'theme.shadows'
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductDetails = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();
  const goto = (index) => {
    setSlideIndex(index);
    zoomSlider.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };
  const totalReviews = 38;
  const averageRating = 4.9;

  const { id } = useParams();
  const [productData, setProductData] = useState([]);
  const [reviewDatas, setReviewDatas] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);
    });
    fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
      setReviewDatas(res)
    })
  }, [id]);
  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Product View</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyleBreadcrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyleBreadcrumb
              href="#"
              label="Products"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyleBreadcrumb label="Products View" />
          </Breadcrumbs>
        </div>
        <div className="card w-100 productDetailsSection">
          <div className="row">
            <div className="col-md-5">
              <div className="sliderWrapper pt-3 pb-3 pl-4 pr-4">
                <h6 className="mb-3">Product Gallery</h6>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  navigation={false}
                  slidesPerGroup={1}
                  modules={[Navigation]}
                  ref={zoomSlider}
                  className="mb-4"
                >
                  {productData?.images?.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="item">
                          <img src={item} className="w-100" />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                <Swiper
                  slidesPerView={4}
                  spaceBetween={0}
                  // navigation={true}
                  slidesPerGroup={1}
                  modules={[Navigation]}
                >
                  {productData?.images?.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div
                          className={`item ${
                            slideIndex === 0 && 'item_active'
                          }`}
                        >
                          <img
                            className="w-100"
                            onClick={() => goto(index)}
                            src={item}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
            <div className="col-md-7">
              <div className="productWrapper pt-3 pb-3 pl-4 pr-4">
                <h6 className="mb-3 ml-0">Product Details</h6>
                <h4 className="mb-3">{productData?.name}</h4>
                <div className="productInfo">
                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <FaStore />
                      </span>
                      <span className="name">Brand</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>{productData?.brand}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <BiCategoryAlt />
                      </span>
                      <span className="name">Category</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>{productData?.catName}</span>
                    </div>
                  </div>
                  {(productData?.ramName?.length > 0 ||
                    productData?.weightName?.length > 0 ||
                    productData?.sizeName?.length > 0) && (
                    <>
                      {productData?.sizeName?.length > 0 && (
                        <div className="row">
                          <div className="col-sm-3 d-flex align-items-center">
                            <span className="icon">
                              <BsFileEarmarkRuledFill />
                            </span>
                            <span className="name">Size</span>
                          </div>
                          <div className="col-sm-9">
                            :
                            <span>
                              <ul className="list list-inline tags sml">
                                {productData?.sizeName?.map((size, index) => (
                                  <li
                                    className="list-inline-item m-1"
                                    key={index}
                                  >
                                    <span>{size.sizeName}</span>
                                  </li>
                                ))}
                              </ul>
                            </span>
                          </div>
                        </div>
                      )}
                      {productData?.weightName?.length > 0 && (
                        <div className="row">
                          <div className="col-sm-3 d-flex align-items-center">
                            <span className="icon">
                              <BsFileEarmarkRuledFill />
                            </span>
                            <span className="name">Weight</span>
                          </div>
                          <div className="col-sm-9">
                            :
                            <span>
                              <ul className="list list-inline tags sml">
                                {productData?.weightName?.map((w, index) => (
                                  <li className="list-inline-item" key={index}>
                                    <span>{w.weightName}</span>
                                  </li>
                                ))}
                              </ul>
                            </span>
                          </div>
                        </div>
                      )}
                      {productData?.ramName?.length > 0 && (
                        <div className="row">
                          <div className="col-sm-3 d-flex align-items-center">
                            <span className="icon">
                              <BsFileEarmarkRuledFill />
                            </span>
                            <span className="name">Ram / Rom</span>
                          </div>
                          <div className="col-sm-9">
                            :
                            <span>
                              <ul className="list list-inline tags sml">
                                {productData?.ramName?.map((ram, index) => (
                                  <li className="list-inline-item" key={index}>
                                    <span>{ram.ramName}</span>
                                  </li>
                                ))}
                              </ul>
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <ImPriceTags />
                      </span>
                      <span className="name">OLD Price</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>{productData?.oldPrice}$</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <ImPriceTags />
                      </span>
                      <span className="name">Price</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>{productData?.price}$</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <IoIosCart />
                      </span>
                      <span className="name">Stock</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>({productData?.countInStock}) Cái</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <IoStarHalf />
                      </span>
                      <span className="name">Review</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>({reviewDatas?.length}) Review</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <IoStarHalf />
                      </span>
                      <span className="name">Review</span>
                    </div>
                    <div className="col-sm-9">
                      : <span>({productData?.dateCreated})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h5 className="mt-4 mb-3">Product Description</h5>
            <p>{productData?.description}</p>
            {/* <h5 className="mt-4 mb-4">Rating Analytics</h5>
            <div className="rating-container">
              <div className="rating-analytics">
                <div className="rating-bar">
                  <span>5 Star</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '80%' }}></div>
                  </div>
                  <span className="count">(22)</span>
                </div>

                <div className="rating-bar">
                  <span>4 Star</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '50%' }}></div>
                  </div>
                  <span className="count">(06)</span>
                </div>

                <div className="rating-bar">
                  <span>3 Star</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '30%' }}></div>
                  </div>
                  <span className="count">(05)</span>
                </div>

                <div className="rating-bar">
                  <span>2 Star</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '20%' }}></div>
                  </div>
                  <span className="count">(03)</span>
                </div>

                <div className="rating-bar">
                  <span>1 Star</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '10%' }}></div>
                  </div>
                  <span className="count">(02)</span>
                </div>
              </div>

              <div className="rating-summary">
                <p>Total Review ({totalReviews})</p>
                <h1>{averageRating}</h1>
                <div className="stars">
                  {[...Array(Math.floor(averageRating))].map(() => (
                    <i className="fas fa-star"></i>
                  ))}
                  {averageRating % 1 >= 0.5 && (
                    <i className="fas fa-star-half-alt"></i>
                  )}
                </div>
                <p>Your Average Rating Star</p>
              </div>
            </div> */}
            <h5 className="mt-4 mb-4">Customer Review</h5>
            <div className="review_section">
              {
                reviewDatas?.map((item, index) => {
                  return (
                    <div className="review_row">
                      <div className="row">
                        <div className="col-sm-7 d-flex">
                          <div className="d-flex flex-column">
                            <div className="userInfo mb-3 d-flex align-items-center">
                              <UserAvataComponent
                                img="https://antimatter.vn/wp-content/uploads/2022/11/hinh-anh-gai-xinh-trung-quoc.jpg"
                                lg={true}
                              />
                              <div className="info pl-3">
                                <h5>
                                  {item?.customerName}
                                  <span>{item?.dateCreated}</span>
                                </h5>
                              </div>
                            </div>
                            <Rating
                              name="read-only"
                              value={item?.customerRating}
                              precision={0.5}
                              readOnly
                            />
                          </div>
                        </div>
                        <div class="col-md-5 d-flex align-items-center">
                          <div class="ml-auto">
                            <Button className="btn-big btn-blue btn-lg btn-round">
                              <FaReply />
                              &nbsp; Reply
                            </Button>
                          </div>
                        </div>
                        <p
                          class="mt-3 pl-4"
                          style={{ color: '#403e57', fontSize: '1.6rem' }}
                        >
                          {item?.review}
                        </p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            {/* <h5 className="mt-4 mb-4">Review Reply Form</h5>
            <form action="" className="review_form">
              <textarea placeholder="Wrire here"></textarea>
              <Button className="btn-blue">drop your replies</Button>
            </form> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
