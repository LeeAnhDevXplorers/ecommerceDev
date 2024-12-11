import React from 'react';
import { TiDelete } from 'react-icons/ti';

const ImageUpload = ({ previews, onChangeFile, removeFile }) => (
  <div className="imagesUploadSec">
    <h5 className="mb-4" style={{ fontSize: '1.6rem', marginTop: '10px' }}>
      Media And Published
    </h5>
    <h1 style={{fontSize: "1.5rem", textAlign: "center", margin: "20px"}}>Bạn vui lòng chọn lại toàn bộ ảnh! (Nếu không chọn ảnh sẽ bị xóa)</h1>
    <div className="imgUploadBox d-flex align-items-center">
      {previews.map((item, index) => (
        <div className="uploadBox d-flex" key={index}>
          <span onClick={() => removeFile(index)} className="remove">
            <TiDelete />
          </span>
          <div className="box">
            <img alt="preview" className="w-100 h-100" src={item} />
          </div>
        </div>
      ))}
      <div className="uploadBox">
        <input type="file" onChange={onChangeFile} name="images" multiple />
        <div className="info">
          <h5>Image Upload</h5>
        </div>
      </div>
    </div>
  </div>
);

export default ImageUpload;
