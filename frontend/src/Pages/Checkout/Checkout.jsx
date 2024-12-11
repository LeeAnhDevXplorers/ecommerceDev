import { Button, colors } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { alpha, styled } from '@mui/material/styles';
import process from 'process';
import React, { useContext, useEffect, useState } from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';
window.process = process;
const Checkout = () => {
  const context = useContext(MyContext);
  const [country, setCountry] = useState('');
  const [cartData, setCartData] = useState([]);
  const history = useNavigate();
  const [totalAmount, setTotalAmount] = useState();
  const [formFields, setFormFields] = useState({
    fullName: '',
    country: '',
    conscious: '',
    district: '',
    specificAddress: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
      setTotalAmount(
        res
          .map((item) => parseInt(item.price) * item.quantity)
          .reduce((total, value) => total + value, 0)
      );
    });
  }, []);
  const handleChange = (event) => {
    setCountry(event.target.value);
  };

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const checkout = (e) => {
    e.preventDefault();

    console.log(formFields);
    if (
      formFields.fullName === '' ||
      formFields.country === '' ||
      formFields.conscious === '' ||
      formFields.district === '' ||
      formFields.specificAddress === '' ||
      formFields.zipCode === '' ||
      formFields.phoneNumber === '' ||
      formFields.email === ''
    ) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Vui lòng nhập đầy đủ các ô  ',
      });
      return false;
    }

    const addressInfo = {
      name: formFields.fullName,
      phoneNumber: formFields.phoneNumber,
      address: [
        formFields.specificAddress,
        formFields.district,
        formFields.conscious,
        formFields.country
      ].join(' '),

      pincode: formFields.zipCode,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };

    var options = {
      key: 'rzp_test_lhO6WJjtmN7Evj',
      key_secret: 'cQ1LJqRbvB92QhrWUFO4h2X7',
      amount: parseInt(totalAmount * 100),
      currency: 'INR',
      order_receipt: 'order_rcptid_' + formFields.fullName,
      name: 'E-Bharat',
      description: 'for testing purpose',
      handler: function (response) {
        // console.log(response)
        const paymentId = response.razorpay_payment_id;
        const user = JSON.parse(localStorage.getItem('user'));

        const payLoad = {
          name: addressInfo.name,
          phoneNumber: formFields.phoneNumber,
          address: addressInfo.address,
          pincode: addressInfo.pincode,
          amount: parseInt(totalAmount * 100),
          paymentId: paymentId,
          email: user.email,
          userId: user.userId,
          products: cartData,
        };
        console.log(payLoad);

        postData(`/api/orders/create`, payLoad).then((res) => {
          history('/orders');
        });
      },
    };
    var pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <form action="" className="checkout-form" onSubmit={checkout}>
            <div className="row">
              <div className="col-md-8">
                <h2 className="hd">Billing Details</h2>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Full Name *
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="fullName"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Quốc gia
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="country"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
                <h5>Tỉnh / Huyện</h5>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Tỉnh *
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="conscious"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Huyện
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="district"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
                {/* <h5>Coutry</h5>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          htmlFor="demo-customized-select-native"
                        >
                          Country
                        </InputLabel>
                        <NativeSelect
                          sx={{ width: '100%' }}
                          value={country}
                          onChange={handleChange}
                          input={<BootstrapInput placeholder="Country" />}
                        >
                          <option aria-label="None" value="" />
                          {context.countryList?.map((item, index) => {
                            return (
                              <option value={item.country} key={index}>
                                {item.country}
                              </option>
                            );
                          })}
                        </NativeSelect>
                      </FormControl>
                    </div>
                  </div>
                </div> */}
                <h5>Địa chỉ cụ thể</h5>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Số nhà, tên đường, ...
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="specificAddress"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
                <h5>ZIP Code *</h5>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          ZIP Code
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="zipCode"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Phone
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="phoneNumber"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <FormControl variant="standard" fullWidth>
                        <InputLabel
                          sx={{ fontSize: '1.8rem' }}
                          shrink
                          htmlFor="bootstrap-input"
                        >
                          Email
                        </InputLabel>
                        <BootstrapInput
                          id="bootstrap-input"
                          name="email"
                          onChange={onChangeInput}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card orderInfo">
                  <h6 className="hd">Your Order</h6>
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData?.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              {item?.productTitle?.substr(0, 20) + '...'}{' '}
                              <b>x{item?.quantity}</b>
                            </td>
                            <td>{item?.price}vnđ</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>SubTotal</th>
                        {/* Tổng tất cả giá trị trong cart */}
                        <th>
                          {cartData?.reduce(
                            (acc, item) =>
                              acc + (item?.price * item?.quantity || 0),
                            0
                          )}
                          vnđ
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                  <Button
                    className="btn-pay btn btn-primary w-100 mt-3"
                    type="submit"
                  >
                    <IoBagCheckOutline />
                    Thanh Toán
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#F3F6F9',
    border: '1px solid',
    borderColor: '#E0E3E7',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
      borderColor: '#2D3843',
    }),
  },
}));

export default Checkout;
