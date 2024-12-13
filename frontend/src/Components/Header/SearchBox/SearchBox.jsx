import Button from '@mui/material/Button';
import React, { useContext, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';
import { fetchDataFromApi } from '../../../utils/api';
import { MyContext } from '../../../App';
const SearchBox = () => {
  const history = useNavigate()
  const [searchFields, setSearchFilelds] = useState('');
  const context = useContext(MyContext)
  const onchangeValue = (e) => {
    setSearchFilelds(e.target.value);
  };

  const searchProduct = () => {
    fetchDataFromApi(`/api/search?q=${searchFields}`).then((res) => {
      context.setSearchData(res)
      history("/search")
      // console.log(res);
      
    })
  }

 
  return (
    <div className="headerSearch ml-3 mr-3">
      <input
        type="text"
        placeholder="Search for products..."
        onChange={onchangeValue}
      />
      <Button onClick={searchProduct}>
        <IoSearch />
      </Button>
    </div>
  );
};

export default SearchBox;
