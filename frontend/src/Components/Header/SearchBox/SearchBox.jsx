import React from "react";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import "./SearchBox.css";
const SearchBox = () => {
  return (
    <div class="headerSearch ml-3 mr-3">
      <input type="text" placeholder="Search for products..." />
      <Button>
        <IoSearch />
      </Button>
    </div>
  );
};

export default SearchBox;
