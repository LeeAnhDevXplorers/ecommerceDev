import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';
import { MdEmail, MdOutlineSecurity } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

import { assets } from '../../assets/assets';
import { postData } from '../../utils/api';
import './SignUp.css';
const SignUp = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

  const signUp = async (e) => {
    e.preventDefault();

    const { name, phone, email, password, confirmPassword } = formFields;

    // Kiểm tra các trường không được để trống
    if (
      [name, phone, email, password, confirmPassword].some(
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

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Mật khẩu không trùng khớp!',
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

        navigate('/login');
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
                <h4>ĐĂNG KÝ TÀI KHOẢN</h4>
              </div>

              <form className="px-3" onSubmit={signUp}>
                <div className="form-input">
                  <span>
                    <FaUserAlt />
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    tabindex="10"
                    required
                    onChange={onchangeInput}
                  />
                </div>
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
                    <FaPhone />
                  </span>
                  <input
                    type="text"
                    name="phone"
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
                <div className="form-input">
                  <span>
                    <MdOutlineSecurity />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Password"
                    required
                    onChange={onchangeInput}
                  />
                </div>

                <div className="mb-3">
                  <button type="submit" className="btn btn-block">
                    Đăng ký
                  </button>
                </div>
                <div
                  className="text-center mb-2"
                  style={{ fontSize: '1.6rem' }}
                >
                  <div className="text-center mb-4 text-white">
                    or register with
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
                  Already have an account?
                  <Link className="login-link" to="/login">
                    {' '}
                    Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
