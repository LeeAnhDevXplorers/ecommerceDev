import { Radio, RadioGroup, Rating } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useContext, useEffect, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link, useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import { assets } from '../../assets/assets';
import './SideBar.css';
const SideBar = (props) => {
  const [value, setValue] = useState([100, 60000]);
  //  const [rating, setRating] = useState(2);
  const context = useContext(MyContext);
  const [subName, setSubName] = useState('');
  const [filterSubCat, setFilterSubCat] = useState();

  const handleChange = (event) => {
    setFilterSubCat(event.target.value);
    props.filterData(event.target.value);
  };

  const { id } = useParams();
  useEffect(() => {
    setSubName(id);
  }, [id]);

  useEffect(() => {
    props.filterByPrice(value, subName);
  }, [value]);

  const filterByRating = (rating) => {
    props.filterByRating(rating, subName);
  };

  return (
    <div className="sideBar">
      <div className="sticky">
        <div className="filterBox">
          <h6>DANH MỤC SẢN PHẨM</h6>
          <div className="scroll">
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={filterSubCat}
              onChange={handleChange}
            >
              {context.subCatData?.length !== 0 &&
                context.subCatData?.map((item, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      value={item?._id}
                      control={<Radio />}
                      label={item?.subCat}
                    />
                  );
                })}
            </RadioGroup>
          </div>
        </div>
        <div className="filterBox">
          <h6>LỌC THEO GIÁ</h6>
          <RangeSlider
            value={value}
            onInput={setValue}
            min={100}
            max={60000}
            step={5}
          />
          <div className="d-flex pt-2 pb-2 priceRange">
            <span>
              From: <strong className="text-dark">Rs: {value[0]}</strong>
            </span>
            <span className="ml-auto">
              To: <strong className="text-dark">Rs: {value[1]}</strong>
            </span>
          </div>
        </div>
        <div className="filterBox">
          <h6>Lọc theo đánh giá</h6>
          <div className="scroll">
            {/* <ul>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="In Stock"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="On Sale"
              />
            </li>
          </ul> */}
            <ul>
              <li onClick={() => filterByRating(5)}>
                <Rating name="read-only" value={5} size="small" />
              </li>
              <li onClick={() => filterByRating(4)}>
                <Rating name="read-only" value={4} size="small" />
              </li>
              <li onClick={() => filterByRating(3)}>
                <Rating name="read-only" value={3} size="small" />
              </li>
              <li onClick={() => filterByRating(2)}>
                <Rating name="read-only" value={2} size="small" />
              </li>
              <li onClick={() => filterByRating(1)}>
                <Rating name="read-only" value={1} size="small" />
              </li>
              <li onClick={() => filterByRating(0)}>
                <Rating name="read-only" value={0} size="small" />
              </li>
            </ul>
          </div>
        </div>

        <div className="filterBox">
          <h6>THƯƠNG HIỆU</h6>
          <div className="scroll">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Louis Vuitton"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Gucci"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Chanel"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Dior"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="Adidas"
                />
              </li>
            </ul>
          </div>
        </div>
        <Link to="#">
          <img className="w-100" src={assets.sidebar_banner} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
