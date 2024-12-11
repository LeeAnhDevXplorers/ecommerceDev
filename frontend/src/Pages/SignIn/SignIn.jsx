import { Backdrop, CircularProgress } from '@mui/material/';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { assets } from '../../assets/assets';
import './SignIn.css';
import { postData } from '../../utils/api';
const SignIn = () => {
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
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

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gửi yêu cầu đăng nhập
      const response = await postData('/api/user/signin', formFields);

      if (response.status) {
        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem('token', response.token);

        const user = {
          name: response.user?.name || '',
          email: response.user?.email || '',
          userId: response.user?._id || '',
        };
        localStorage.setItem('user', JSON.stringify(user));

        // Hiển thị thông báo thành công
        context.setAlertBox({
          open: true,
          error: false,
          msg: response.msg || 'Đăng nhập thành công.',
        });

        // Điều hướng sau khi hiển thị thông báo
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        // Xử lý khi đăng nhập thất bại
        context.setAlertBox({
          open: true,
          error: true,
          msg: response.msg || 'Đăng nhập thất bại.',
        });
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình gửi yêu cầu
      console.error('Lỗi đăng nhập:', error);

      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Sai EMAIL hoặc MẬT KHẨU. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
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
            <h2 className="mb-4">Sign In</h2>
            <form action="" className="mt-3" onSubmit={signIn}>
              <div className="form-group">
                <TextField
                  id="standard-basic"
                  label="Email"
                  type="email"
                  name="email"
                  onChange={onchangeInput}
                  variant="standard"
                  required
                  className="w-100"
                />
              </div>
              <div className="form-group mb-4">
                <TextField
                  id="standard-basic"
                  label="Password"
                  type="password"
                  variant="standard"
                  required
                  className="w-100"
                  name="password"
                  onChange={onchangeInput}
                />
              </div>
              <a className="border-effect cursor">Forgot password? </a>
              <div className="d-flex align-items-center mt-3 mb-3 row">
                <Button type='submit' className="btn col btn-blue btn-lg btn-big">
                  Sign In
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
                Not Registered?
                <Link className="border-effect cursor" to={'/signUp'}>
                  Sign Up
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
      <Backdrop
        sx={{
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          transition: 'opacity 0.3s ease-in-out',
          zIndex: 9999,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={50} thickness={2} />
      </Backdrop>
    </div>
  );
};

export default SignIn;
