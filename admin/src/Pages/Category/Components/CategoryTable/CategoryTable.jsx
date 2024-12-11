// CategoryTable.js
import { Button } from '@mui/material';
import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CategoryTable = ({
  catData,
  editCat,
  handleOpenDeleteDialog,
  isShowTable,
  isShowIcon,
}) => {
  return (
    <>
      {isShowTable ? (
        <>
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th>UID</th>
                <th>IMAGE</th>
                <th>NAME CATEGORY</th>
                <th>COLOR</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {catData?.categoryList?.map((item, index) => (
                <tr key={item._id}>
                  <td>#{index + 1}</td>
                  {/* <td>
                    <div className="d-flex align-items-center productBox">
                      <div className="imgWrapper">
                        <div className="img">
                          <img
                            src={item.images?.[0]}
                            alt={item.name}
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </td> */}
                  <td>
                    <div className="d-flex align-items-center productBox">
                      <div
                        className="imgWrapper"
                        style={{
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '50px',
                          height: '50px',
                        }}
                      >
                        <div
                          className="img"
                          style={{
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50px',
                            height: '50px',
                          }}
                        >
                          {/* Lặp qua mảng images và hiển thị tất cả các hình ảnh */}
                          {item.images && item.images.length > 0 ? (
                            item.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={item.name + ' image ' + idx}
                                className="w-100"
                                style={{ marginBottom: '5px' }}
                              />
                            ))
                          ) : (
                            <p>No images available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div
                      className="text-center"
                      style={{
                        backgroundColor: item.color,
                        height: '50px',
                        lineHeight: '50px',
                      }}
                    >
                      {item.color}
                    </div>
                  </td>
                  <td>
                    <div className="actions d-flex align-items-center">
                      <Button
                        className="success"
                        color="success"
                        onClick={() => editCat(item._id)}
                      >
                        <FaPencilAlt />
                      </Button>
                      <Button
                        className="error"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(item._id)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th>UID</th>
                <th>NAME CATEGORY</th>
                <th>SUB CATEGORY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {catData?.data?.map((item, index) => (
                <tr key={item._id}>
                  <td>#{index + 1}</td>
                  <td>{item.category?.name}</td>
                  <td>{item.subCat}</td>
                  <td>
                    <div className="actions d-flex align-items-center">
                      {isShowIcon && (
                        <Button
                          className="success"
                          color="success"
                          onClick={() => editCat(item._id)}
                        >
                          <FaPencilAlt />
                        </Button>
                      )}

                      <Button
                        className="error"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(item._id)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default CategoryTable;
