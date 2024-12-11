import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import {
  Backdrop,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';

import { MdDelete } from 'react-icons/md';

import { emphasize, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import DeleteDialog from '../Category/Components/DeleteDialog/DeleteDialog';

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductRams = () => {
  const [pRamData, setPRamData] = useState([]);
  const [deleteType, setDeleteType] = useState('');
  const [pWeigthData, setPWeigthData] = useState([]);
  const [pSizeData, setPSizeData] = useState([]);
  const [formFieldsrRam, setFormFieldsRam] = useState({ ramName: '' });
  const [formFieldsrWeigth, setFormFieldsWeigth] = useState({ weightName: '' });
  const [formFieldsrSize, setFormFieldsSize] = useState({ sizeName: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  const navigate = useNavigate();
  const context = useContext(MyContext); // Ensure the context is imported

  useEffect(() => {
    fetchDataFromApi('/api/prams').then((res) => setPRamData(res.data));
    fetchDataFromApi('/api/weight').then((res) => setPWeigthData(res.data));
    fetchDataFromApi('/api/psize').then((res) => setPSizeData(res.data));
  }, []);

  useEffect(() => {
    console.log('formFieldsrRam changed:', formFieldsrRam);
  }, [formFieldsrRam]);

  const validateForm = (type) => {
    const formErrors = {};

    if (type === 'ram' && !formFieldsrRam.ramName)
      formErrors.ramName = 'RAM name is required';
    if (type === 'weight' && !formFieldsrWeigth.weightName)
      formErrors.weightName = 'Weight name is required';
    if (type === 'size' && !formFieldsrSize.sizeName)
      formErrors.sizeName = 'Size name is required';

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`); // Kiểm tra giá trị nhập vào
    setState((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      console.log('Updated form fields:', updated); // Kiểm tra giá trị sau khi cập nhật
      return updated;
    });
  };
  // Handle RAM submit
  const handleSubmitRam = async (e) => {
    e.preventDefault();
    if (validateForm('ram')) {
      setLoading(true);
      try {
        const data = {
          ramName: formFieldsrRam.ramName,
        };

        // Log before sending request
        console.log('Sending data:', data);

        const res = await postData('/api/prams/create', data);

        // Log response
        console.log('Response:', res);

        if (res.success) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          setFormFieldsRam({ ramName: '' });
          // Reload the page upon successful submission

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
        console.error('Submit error:', error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: 'An error occurred during submission.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log('RAM form has errors.');
    }
  };

  // Handle Weight submit
  const handleSubmitWeigth = async (e) => {
    e.preventDefault();
    if (validateForm('weight')) {
      setLoading(true);
      try {
        const data = { weightName: formFieldsrWeigth.weightName };
        const res = await postData('/api/weight/create', data);
        if (res.success) {
          setFormFieldsWeigth({ weightName: '' });
          // Reload the page upon successful submission
          context.setAlertBox({
            open: true,
            error: false,
            msg: 'Weight category created successfully!',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.message || 'An error occurred.',
          });
        }
      } catch (error) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: 'An error occurred during submission.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Weight form has errors.');
    }
  };

  // Handle Size submit
  const handleSubmitSize = async (e) => {
    e.preventDefault();
    if (validateForm('size')) {
      setLoading(true);
      try {
        const data = { sizeName: formFieldsrSize.sizeName };
        const res = await postData('/api/psize/create', data);
        if (res.success) {
          setFormFieldsSize({ sizeName: '' });
          // Reload the page upon successful submission
          context.setAlertBox({
            open: true,
            error: false,
            msg: 'Size category created successfully!',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.message || 'An error occurred.',
          });
        }
      } catch (error) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: 'An error occurred during submission.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Size form has errors.');
    }
  };

 const handleDeleteRams = async (id) => {
   context.setProgress(30); // Set progress to 30% to indicate the deletion process has started

   try {
     await deleteData(`/api/prams/${id}`); // Call API to delete the category
     context.setProgress(70); // Set progress to 70% after the deletion request is made
     context.setProgress(100); // Set progress to 100% after categories are fetched
     window.location.reload(); // Reload the page after successful deletion
   } catch (error) {
     console.error('Failed to delete category:', error);
     context.setProgress(0); // Optionally reset progress to 0% on error or handle as needed
   }
 };

 const handleDeleteWeight = async (id) => {
   context.setProgress(30); // Set progress to 30% to indicate the deletion process has started

   try {
     await deleteData(`/api/weight/${id}`); // Call API to delete the category
     context.setProgress(70); // Set progress to 70% after the deletion request is made
     context.setProgress(100); // Set progress to 100% after categories are fetched
     window.location.reload(); // Reload the page after successful deletion
   } catch (error) {
     console.error('Failed to delete category:', error);
     context.setProgress(0); // Optionally reset progress to 0% on error or handle as needed
   }
 };

 const handleDeleteSize = async (id) => {
   context.setProgress(30); // Set progress to 30% to indicate the deletion process has started

   try {
     await deleteData(`/api/psize/${id}`); // Call API to delete the category
     context.setProgress(70); // Set progress to 70% after the deletion request is made
     context.setProgress(100); // Set progress to 100% after categories are fetched
     window.location.reload(); // Reload the page after successful deletion
   } catch (error) {
     console.error('Failed to delete category:', error);
     context.setProgress(0); // Optionally reset progress to 0% on error or handle as needed
   }
 };

  return (
    <div>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Product Upload</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyleBreadcrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyleBreadcrumb
              href="#"
              label="Products"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyleBreadcrumb label="Product Upload" />
          </Breadcrumbs>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <form onSubmit={handleSubmitWeigth} className="form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card mt-0 p-4 w-100">
                      <TextField
                        label="Weight Name"
                        variant="outlined"
                        type="text"
                        name="weightName"
                        id="weightName"
                        value={formFieldsrWeigth.weightName || ''} // Đảm bảo giá trị không phải là null
                        onChange={(e) =>
                          handleInputChange(e, setFormFieldsWeigth)
                        }
                      />
                      {errors.weightName && (
                        <div
                          style={{ fontSize: '1.4rem' }}
                          className="text-danger"
                        >
                          {errors.weightName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card p-4 mt-0 w-100">
                  <Button
                    type="submit"
                    className="btn-blue w-100 mt-5"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'ADD'}
                  </Button>
                </div>
              </form>
            </div>
            <div
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '10px',
              }}
              className="table-responsive w-100 mt-5"
            >
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>UID</th>
                    <th>Name</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pWeigthData.map((item, index) => {
                    return (
                      <tr key={item._id || index}>
                        <td>#{index + 1}</td>
                        <td>{item.weightName}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="error"
                              color="error"
                              aria-label="Delete product"
                              onClick={() => handleDeleteWeight(item._id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <form onSubmit={handleSubmitSize} className="form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card mt-0 p-4 w-100">
                      <TextField
                        label="Size Name"
                        variant="outlined"
                        type="text"
                        name="sizeName"
                        id="sizeName"
                        value={formFieldsrSize.sizeName || ''} // Đảm bảo giá trị không phải là null
                        onChange={(e) =>
                          handleInputChange(e, setFormFieldsSize)
                        }
                      />
                      {errors.sizeName && (
                        <div
                          style={{ fontSize: '1.4rem' }}
                          className="text-danger"
                        >
                          {errors.sizeName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card p-4 mt-0 w-100">
                  <Button
                    type="submit"
                    className="btn-blue w-100 mt-5"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'ADD'}
                  </Button>
                </div>
              </form>
            </div>
            <div
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '10px',
              }}
              className="table-responsive w-100 mt-5"
            >
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>UID</th>
                    <th>Name</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pSizeData.map((item, index) => {
                    return (
                      <tr key={item._id || index}>
                        <td>#{index + 1}</td>
                        <td>{item.sizeName}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="error"
                              color="error"
                              aria-label="Delete product"
                              onClick={() => handleDeleteSize(item._id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <form onSubmit={handleSubmitRam} className="form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card mt-0 p-4 w-100">
                      <TextField
                        label="Ram Name"
                        variant="outlined"
                        type="text"
                        name="ramName"
                        id="ramName"
                        value={formFieldsrRam.ramName || ''} // Đảm bảo giá trị không phải là null
                        onChange={(e) => handleInputChange(e, setFormFieldsRam)}
                      />
                      {errors.ramName && (
                        <div
                          style={{ fontSize: '1.4rem' }}
                          className="text-danger"
                        >
                          {errors.ramName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card p-4 mt-0 w-100">
                  <Button
                    type="submit"
                    className="btn-blue w-100 mt-5"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'ADD'}
                  </Button>
                </div>
              </form>
            </div>
            <div
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '10px',
              }}
              className="table-responsive w-100 mt-5"
            >
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>UID</th>
                    <th>Name</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pRamData.map((item, index) => {
                    return (
                      <tr key={item._id || index}>
                        <td>#{index + 1}</td>
                        <td>{item.ramName}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="error"
                              color="error"
                              aria-label="Delete product"
                              onClick={() => handleDeleteRams(item._id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRams;
