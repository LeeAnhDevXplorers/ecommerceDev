import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { default as React, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { assets } from '../../assets/assets';
import { postData } from '../../utils/api';
const SignUp = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false,
  });
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  });

  const onchangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const signUp = async (e) => {
    console.log(formFields);

    e.preventDefault();

    const { name, phone, email, password } = formFields;

    // Kiểm tra các trường không được để trống
    if (
      [name, phone, email, password].some(
        (field) => field.trim() === ''
      )
    ) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Không được để trống các trường!',
      });
      return;
    }

    try {
      const res = await postData('/api/user/signup', {
        name,
        phone,
        email,
        password,
      });

      if (res.status) {
        context.setAlertBox({
          open: true,
          error: false,
          msg: 'Đăng ký thành công!',
        });

        navigate('/signIn');
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: res.msg,
        });
      }
    } catch (error) {
      console.error('Đăng ký thất bại:', error);

      context.setAlertBox({
        open: true,
        error: true,
        msg: error.response?.data?.msg || 'Có lỗi xảy ra, vui lòng thử lại!',
      });
    }
  };
  return (
    <div>
      <section className="section signInPage">
        <div className="shape-bottom">
          <svg
            fill="#fff"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 1921 819.8"
            style={{ enableBackground: 'new 0 0 1921 819.8' }}
          >
            <path
              class="st0"
              d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
            ></path>
          </svg>
        </div>
        <div className="container">
          <div className="box card shadow border-0">
            <div className="text-center">
              <img src={assets.logo} alt="" />
            </div>
            <h2 className="mb-4">Sign Up</h2>
            <form action="" className="mt-3" onSubmit={signUp}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      id="standard-basic"
                      label="Name"
                      type="text"
                      name="name"
                      variant="standard"
                      required
                      className="w-100"
                      onChange={onchangeInput}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      id="standard-basic"
                      label="Phone No."
                      name="phone"
                      type="text"
                      variant="standard"
                      required
                      className="w-100"
                      onChange={onchangeInput}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <TextField
                  id="standard-basic"
                  label="Email"
                  type="email"
                  name="email"
                  variant="standard"
                  required
                  className="w-100"
                  onChange={onchangeInput}
                />
              </div>
              <div className="form-group mb-4">
                <TextField
                  id="standard-basic"
                  label="Password"
                  type="password"
                  name="password"
                  onChange={onchangeInput}
                  variant="standard"
                  required
                  className="w-100"
                />
              </div>
              {/* <div className="form-group mb-4">
                <TextField
                  id="standard-basic"
                  label="Repeat your password"
                  type="password"
                  variant="standard"
                  required
                  className="w-100"
                />
              </div> */}
              {/* <a className="border-effect cursor">Forgot password? </a> */}
              <div className="d-flex align-items-center mt-3 mb-3 row">
                <Button
                  type="submit"
                  className="btn col btn-blue btn-lg btn-big"
                >
                  Sign Up
                </Button>
                <Link to={'/'}>
                  <Button
                    className="btn col btn-lg btn-big col ml-3"
                    variant="outlined"
                    onClick={() => context.setisHeaderFooterShow(true)}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>

              <p>
                Already registered?
                <Link className="border-effect cursor" to={'/signIn'}>
                  LogIn
                </Link>
              </p>
              <h4 className="social  text-center font-weight-bold mt-5">
                Or continue with social account
              </h4>
              <div className="form-btn">
                <Button className="logoBtn">
                  <span className="cursor">
                    <img
                      className="w-100"
                      src={assets.btn_sigin_google}
                      alt=""
                    />
                  </span>
                </Button>
                <Button className="logoBtn">
                  <span className="cursor">
                    <img className="w-100" src={assets.btn_sigin_fb} alt="" />
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
