import { Backdrop, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../App';
import { bgColor } from '../../../assets/assets';
import { fetchDataFromApi, postData } from '../../../utils/api';
import BreadcrumbsNav from '../Components/BreadcrumbsNav/BreadcrumbsNav';
import CategoryForm from '../Components/CategoryForm/CategoryForm';
// import './Pages/CategoryAdd.css';

const AddSubcat = () => {
  const [categoryVal, setCategoryVal] = useState('');
  const context = useContext(MyContext);
  const [catData, setCatData] = useState([]);
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formFields, setFormFields] = useState({
    category: '',
    subCat: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log('Fetching category data...'); // Log when the fetching starts
    setLoading(true);
    fetchDataFromApi('/api/category') 
      .then((res) => {
        console.log('Fetched categories:', res); // Log the fetched data
        if (Array.isArray(res.categoryList)) {
          setCatData(res.categoryList);
        } else {
          setCatData([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error); // Log any error during fetching
        setCatData([]);
      })
      .finally(() => {
        setLoading(false);
        console.log('Category data fetching completed'); // Log when fetching is completed
      });
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formFields.category) errors.category = 'Category name is required';
    if (!formFields.subCat) errors.subCat = 'SubCat Category name is required';
    return Object.keys(errors).length === 0;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`);
    setFormFields((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      console.log('Updated form fields:', updated);
      return updated;
    });
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    console.log('Category selected:', value);
    setCategoryVal(value);
    setFormFields((prev) => {
      const updated = {
        ...prev,
        category: value,
      };
      console.log('Updated form fields after select:', updated);
      return updated;
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submit initiated');
  setLoading(true);

  if (!validateForm()) {
    setLoading(false);
    console.log('Form validation failed');
    return;
  }

  // Gửi trực tiếp object thay vì FormData
  const data = {
    category: formFields.category, // Đảm bảo category được gửi đúng
    subCat: formFields.subCat,
  };

  try {
    const res = await postData('/api/subCategory/create', data);
    console.log('API response:', res);
    if (res.success) {
      navigate('/category/categorylist');
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'Category created successfully!',
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: res.message || 'An error occurred.',
      });
    }
  } catch (error) {
    console.error('Request failed:', error);
    context.setAlertBox({
      open: true,
      error: true,
      msg: 'An error occurred during submission.',
    });
  } finally {
    setLoading(false);
    console.log('Form submission completed');
  }
};


  return (
    <div className="right-content w-100">
      <div
        className="card shadow border-0 w-100 flex-row p-4"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h5 className="mb-0">Add Sub Category</h5>
        <BreadcrumbsNav />
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="row">
          <div className="col-md-12">
            <div className="card mt-0 p-4 w-100">
              <CategoryForm
                formFields={formFields}
                handleInputChange={handleInputChange}
                formErrors={formErrors}
                bgColor={bgColor}
                isShowCatPage={true}
                catData={catData}
                handleSelectChange={handleSelectChange}
              />
            </div>
          </div>
        </div>
        <div className="card p-4 mt-0 w-100">
          <Button
            type="submit"
            className="btn-blue w-100 mt-5"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'PUBLISH AND VIEW'}
          </Button>
        </div>
      </form>
      <Backdrop
        sx={{
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 999,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={50} thickness={2} />
      </Backdrop>
    </div>
  );
};

export default AddSubcat;
