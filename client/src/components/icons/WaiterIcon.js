import React from 'react';
import PropTypes from 'prop-types';

const WaiterIcon = ({ width = 24, height = 24 }) => {
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
      className='icon waiter-icon'
    >
      <path d='M12 4C7.58172 4 4 6.69881 4 9H20C20 6.69881 16.4183 4 12 4Z' />
      <circle cx='12' cy='2.75' r='1.5' />
      <line x1='1' y1='10' x2='23' y2='10' />
      <path d='M7 20C7.49106 19.5455 11.3179 19.5 13 19.5C14.6821 19.5 19.5 16 21 15C22.5 14 20 12.5 19.5 12.5C19 12.5 18.377 12.6818 17.5 13.5C16.623 14.3182 15.5 15 14 15.5C12.5 16 11.5 16 11 16C10.5 16 13.5 13.5 13.5 13C13.5 12.5 12 12.5 11.5 12.5C11 12.5 9.5 13 9 13.5C8.5 14 8 14.5 8 14.5M7 20C6.50894 20.4545 4.85512 22 3.87298 22C2.89083 22 2.89094 17.4545 3.13634 16.5455C3.38173 15.6364 4.11833 13.8182 5.10052 13.8182C5.52527 13.8182 8 14.5 8 14.5M7 20C7 20 8.35941 17.9494 7.5 17C6.64059 16.0506 8 14.5 8 14.5' />
    </svg>
  );
};

WaiterIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default WaiterIcon;
