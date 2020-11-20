import React from 'react';
import PropTypes from 'prop-types';

const AvatarIcon = ({ width = 40, height = 40 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 40 40'
      fill='none'
      fillRule='evenodd'
      className='icon avatar-icon'
    >
      <path
        d='M20 0C8.96 0 0 8.96 0 20s8.96 20 20 20 20-8.96 20-20S31.04 0 20 0z'
        fill='#9e9e9e'
        fillRule='nonzero'
      ></path>
      <path
        d='M20 17.727c2.767 0 5-2.233 5-5s-2.233-5-5-5-5 2.233-5 5 2.233 5 5 5zm0 2.954c-6.11 0-10.908 2.954-10.908 5.681A13.018 13.018 0 0 0 20 32.271c4.552 0 8.598-2.354 10.908-5.909 0-2.727-4.798-5.68-10.908-5.68z'
        fill='#ececec'
        fillRule='nonzero'
      ></path>
      <path d='M0 0h40v40H0z'></path>
    </svg>
  );
};

AvatarIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default AvatarIcon;
