import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import './QuantityBox.css';
const QuantityBox = (props) => {
  const [inputVal, setInputVal] = useState(1);
  useEffect(() => {
    if (
      props?.value !== undefined &&
      props?.value !== null &&
      props?.value !== ''
    ) {
      setInputVal(parseInt(props?.value));
    }
  }, [props.selectedQuantity]);
  const minus = () => {
    if (inputVal > 0) {
      setInputVal(inputVal - 1);
    }
  };

  const plus = () => {
    setInputVal(inputVal + 1);
  };

  useEffect(() => {
    props.quantity(inputVal);
    props.selectItem(props.item, inputVal);
  }, [inputVal]);

  return (
    <div className="quantityDrop d-flex align-items-center">
      <Button onClick={minus}>
        <FaMinus />
      </Button>
      <input type="text" value={inputVal} />
      <Button onClick={plus}>
        <FaPlus />
      </Button>
    </div>
  );
};

export default QuantityBox;
