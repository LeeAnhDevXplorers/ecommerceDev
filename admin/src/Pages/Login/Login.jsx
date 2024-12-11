import { Backdrop, CircularProgress } from '@mui/material/';
import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

import { assets } from '../../assets/assets';
import { postData } from '../../utils/api';
const Login = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
    isAdmin: true,
  });
  useEffect(() => {
    context.setisHide(false);
    return () => {
      context.setisHide(true);
    };
  }, [context]);

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
    <>
      <div className="container1">
        <div className="row">
          <div className="col-lg-6 col-md-6 d-none d-md-block infinity-image-container"></div>

          <div className="col-lg-6 col-md-6 infinity-form-container">
            <div className="col-lg-9 col-md-12 col-sm-8 col-xs-12 infinity-form">
              <div className="text-center mb-3">
                <img src={assets.logo1} width="300px" />
              </div>
              <div className="text-center mb-4">
                <h4>ĐĂNG NHẬP</h4>
              </div>

              <form className="px-3" onSubmit={signIn}>
                <div className="form-input">
                  <span>
                    <MdEmail />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    tabindex="10"
                    required
                    onChange={onchangeInput}
                  />
                </div>
                <div className="form-input">
                  <span>
                    <RiLockPasswordFill />
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={onchangeInput}
                  />
                </div>
                {/* <div class="row mb-3">
                  <div class="col-auto d-flex align-items-center">
                    <div class="custom-control custom-checkbox">
                      <FormControlLabel
                        sx={{ color: '#fff', fontSize: '1.6rem' }}
                        control={
                          <Checkbox
                            defaultChecked
                            sx={{ fontSize: '1.6rem' }}
                          />
                        }
                        label="Remember me"
                      />
                    </div>
                  </div>
                </div> */}

                <div className="mb-3">
                  <button type="submit" className="btn btn-block">
                    Đăng nhập
                  </button>
                  <div
                    class="text-right "
                    style={{ fontSize: '1.4rem', marginTop: '8px' }}
                  >
                    <a href="#" class="forget-link">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div
                  className="text-center mb-2"
                  style={{ fontSize: '1.6rem' }}
                >
                  <div className="text-center mb-4 text-white">
                    or login with
                  </div>

                  <Link className="btn btn-social btn-facebook">
                    <Button
                      style={{ color: '#fff', fontSize: '1.6rem' }}
                      variant="outlined"
                    >
                      facebook
                    </Button>
                  </Link>
                  <Link href="" className="btn btn-social btn-google">
                    <Button
                      style={{ color: '#fff', fontSize: '1.6rem' }}
                      variant="outlined"
                    >
                      google
                    </Button>
                  </Link>
                </div>
                <div
                  className="text-center mb-5 text-white"
                  style={{ fontSize: '1.6rem' }}
                >
                  Bạn chưa có tài khoản?
                  <Link className="login-link" to="/signup">
                    {' '}
                    Đăng ký ngay
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default Login;
