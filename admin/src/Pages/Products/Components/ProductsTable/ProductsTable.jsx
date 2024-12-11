import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FaEye, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
const ProductsTable = ({
  productList,
  loading,
  context,
  handleEditP,
  handleOpenDeleteDialog,
  isHomePage, 
}) => {
  return (
    <div className="table-responsive w-100 mt-5">
      <table className="table table-bordered v-align">
        <thead className="thead-dark">
          <tr>
            <th>UID</th>
            <th>PRODUCT</th>
            <th>CATEGORY</th>
            <th>SUB CATEGORY</th>
            <th>BRAND</th>
            <th>PRICE</th>
            <th>STOCK</th>
            <th>RATING</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {productList?.length > 0 ? (
            productList?.map((item, index) => {
                const formattedPrice = parseFloat(item.price).toFixed(3);
              return (
                <tr key={item._id || index}>
                  <td>#{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <div className="img">
                          <img
                            src={`${
                              item.images?.[1]?.replace(/\\/g, '/') ||
                              'defaultImage.jpg'
                            }`}
                            alt="Product"
                            className="w-100"
                          />
                        </div>
                      </div>
                      <div className="info">
                        <h6>{item.name}</h6>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{item.category.name}</td>
                  <td>{item.subCat?.subCat}</td>
                  <td>{item.brand}</td>
                  <td>
                    <del className="old tex">{item.oldPrice}</del>
                    <span className="new text-danger">{formattedPrice}</span>
                  </td>
                  <td>{item.countInStock}</td>
                  <td>{item.rating}</td>
                  <td>
                    <div className="actions d-flex align-items-center">
                      <Link
                        to={`/product/producDetails/${item.id}`}
                        aria-label="View product details"
                      >
                        <Button className="secondary" color="secondary">
                          <FaEye />
                        </Button>
                      </Link>
                      {isHomePage && (
                        <Button
                          className="success"
                          color="success"
                          aria-label="Edit product"
                          onClick={() => handleEditP(item._id)}
                        >
                          <FaPencilAlt />
                        </Button>
                      )}

                      {isHomePage && (
                        <Button
                          className="error"
                          color="error"
                          aria-label="Delete product"
                          onClick={() => handleOpenDeleteDialog(item._id)}
                        >
                          <MdDelete />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                {loading ? 'Loading...' : 'No products found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ProductsTable.propTypes = {
//   productList: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.string,
//       name: PropTypes.string,
//       description: PropTypes.string,
//       images: PropTypes.arrayOf(PropTypes.string),
//       category: PropTypes.shape({
//         name: PropTypes.string,
//       }),
//       brand: PropTypes.string,
//       oldPrice: PropTypes.number,
//       price: PropTypes.number,
//       countInStock: PropTypes.number,
//       rating: PropTypes.number,
//     })
//   ).isRequired,
//   loading: PropTypes.bool,
//   context: PropTypes.shape({
//     baseUrl: PropTypes.string.isRequired,
//   }).isRequired,
//   onEdit: PropTypes.func.isRequired,
//   onDelete: PropTypes.func.isRequired,
// };

export default ProductsTable;
