import React from 'react';
import PropTypes from 'prop-types';

const CashierIcon = ({ width = 24, height = 24 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon cashier-icon'
    >
      <path d='M7 12V8H17V12L20.9376 16.9168M7 12L3 17M7 12H14M3 17V21H21L20.9376 16.9168M3 17L20.9376 16.9168' />
      <path d='M15 4.8H12V3H18V4.8H15ZM15 4.8V7' />
    </svg>
  );
};

CashierIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default CashierIcon;
