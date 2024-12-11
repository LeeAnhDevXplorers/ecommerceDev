import { Backdrop, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../../App';
import { bgColor } from '../../../assets/assets';
import { postData } from '../../../utils/api';
import './CategoryAdd.css';
import BreadcrumbsNav from '../Components/BreadcrumbsNav/BreadcrumbsNav';
import CategoryForm from '../Components/CategoryForm/CategoryForm';
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';


const CategoryAdd = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    color: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Cleanup previews on component unmount
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const validateForm = () => {
    const errors = {};
    if (!formFields.name) errors.name = 'Category name is required';
    if (!formFields.color) errors.color = 'Category color is required';
    if (files.length === 0) errors.images = 'At least one image is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const onChangeFile = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    // Update state to store the selected files
    setFiles((prevFiles) => [...prevFiles, ...files]);

    // Generate preview URLs for the selected files
    const imgArr = Array.from(files).map((file) => URL.createObjectURL(file));

    // Update the previews state with the generated image URLs
    setPreviews((prevArr) => [...prevArr, ...imgArr]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append('name', formFields.name);
    fd.append('color', formFields.color);
    files.forEach((file) => fd.append('images', file));

    // Log the FormData to inspect it
    console.log(...fd);

    try {
      const res = await postData('/api/category/create', fd);
      setLoading(false);
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
      console.error('Request failed:', error); // Log any errors for further debugging
      setLoading(false);
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'An error occurred during submission.',
      });
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
        <h5 className="mb-0">Add Product Category</h5>
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
                isShowCatPage={false}
              />
            </div>
          </div>
        </div>
        <div className="card p-4 mt-0 w-100">
          <ImageUpload previews={previews} onChangeFile={onChangeFile} />
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

export default CategoryAdd;
