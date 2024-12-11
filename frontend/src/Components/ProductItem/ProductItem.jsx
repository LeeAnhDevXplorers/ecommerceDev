import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import React, { useContext, useState } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import './ProductItem.css';
const ProductItem = (props) => {
  const context = useContext(MyContext);

  const viewProductDetails = (_id) => {
    context.setisOpenProductModal({
      id: _id,
      open: true,
    });
  };
  const formatPrice = (price) => {
    return price ? parseInt(price).toString() : '0';
  };
  return (
    <>
      <div className={`productItem ${props.itemView}`}>
        <Link to={`/product/${props.item?._id}`}>
          <div className="imgWrapper">
            <img
              src={props.item?.images[0]}
              alt=""
              className="w-100 img_rapper"
            />
            <div className="badge badge-primary">{props.item?.discount}%</div>
            <div className="actions">
              <Button onClick={() => viewProductDetails(props.item?._id)}>
                <BsArrowsFullscreen />
              </Button>
              <Button>
                <FaRegHeart />
              </Button>
            </div>
          </div>
        </Link>
        <div className="info">
          <Link to={`/product/${props.item?._id}`}>
            <h4>{props.item?.name.substr(0, 30) + '...'}</h4>
          </Link>
          <span className="stock text-success d-block">In Stock</span>
          <Rating
            name="read-only"
            value={props.item?.rating}
            readOnly
            size="small"
            precision={0.5}
            className="rating"
          />
          <div className="d-flex align-items-center justify-content-end">
            <span className="oldPrice">
              ${formatPrice(props.item?.oldPrice)}
            </span>
            <span className="netPrice text-danger ml-2">
              ${formatPrice(props.item?.price)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
