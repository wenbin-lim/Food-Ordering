import React from 'react';
import PropTypes from 'prop-types';

const ReceiptIcon = ({ width = 24, height = 24 }) => {
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
      className='icon receipt-icon'
    >
      <path d='M15 9.41071C15 9.41071 15 8.36607 14.25 7.84375C13.5 7.32143 12.75 7.32143 12 7.32143M12 7.32143C11.25 7.32143 10.5 7.32143 9.75 7.84375C9 8.36607 9 8.88839 9 9.41071C9 9.93304 9 10.4554 9.75 10.9777C10.5 11.5 11.25 11.5 12 11.5C12.75 11.5 13.5 11.5 14.25 12.0223C15 12.5446 15 13.067 15 13.5893C15 14.1116 15 14.6339 14.25 15.1562C13.5 15.6786 12.75 15.6786 12 15.6786M12 7.32143V5M12 15.6786C11.25 15.6786 10.5 15.6786 9.75 15.1562C9 14.6339 9 13.5893 9 13.5893M12 15.6786V18' />
      <path d='M4 2L4 22L8 19.7778L12 22L15.3333 19.7778L20 22V2H4Z' />
    </svg>
  );
};

ReceiptIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ReceiptIcon;
