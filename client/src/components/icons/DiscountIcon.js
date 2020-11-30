import React from 'react';
import PropTypes from 'prop-types';

const DiscountIcon = ({ width = 24, height = 24 }) => {
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
      className='icon discount-icon'
    >
      <circle cx='9' cy='9' r='2' />
      <path d='M8 16L16 8' />
      <path d='M22 4C22 3 2 3.00001 2 4V7.42858C2 8.57143 2.88889 7.42857 4 8.57143C5.11111 9.71429 5 10.8572 5 12C5 13.1429 5.11111 14.2857 4 15.4286C2.88889 16.5714 2 15.4286 2 16.5714V19.2085C2 20.2085 22 20.2085 22 19.2085V16.5714C22 15.4286 21.2222 16.5714 20.1111 15.4286C19 14.2857 19 13.1429 19 12C19 10.8572 19 9.71429 20.1111 8.57143C21.2222 7.42857 22 8.57143 22 7.42858V4Z' />
      <circle cx='15' cy='15' r='2' />
    </svg>
  );
};

DiscountIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default DiscountIcon;
