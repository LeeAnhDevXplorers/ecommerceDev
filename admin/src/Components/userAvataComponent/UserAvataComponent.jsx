import React from 'react';
import './userAvataComponent.css';
const UserAvataComponent = (props) => {
  return (
    <div className={`userImg ${props.lg === true && "lg"}`}>
      <span className="rounded-circle">
        <img
          src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
          alt="User Avatar"
        />
      </span>
    </div>
  );
};

export default UserAvataComponent;
