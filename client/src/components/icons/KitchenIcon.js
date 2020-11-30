import React from 'react';
import PropTypes from 'prop-types';

const KitchenIcon = ({ width = 24, height = 24 }) => {
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
      className='icon kitchen-icon'
    >
      <path d='M7.21557 15L7.5489 20H12.0489M7.21557 15L6.54883 14H6.0489C6.0489 14 2.54886 13.5 3.0489 9.5C3.54893 5.5 9.0489 7 9.0489 7C9.0489 7 9.5489 4 12.0489 4C14.5489 4 15.0489 7 15.0489 7C15.0489 7 20.5489 5.5 21.0489 9.5C21.5489 13.5 18.0489 14 18.0489 14H17.5488L16.8822 15M7.21557 15H12.0489M16.8822 15L16.5489 20H12.0489M16.8822 15H12.0489M12.0489 15V20' />
    </svg>
  );
};

KitchenIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default KitchenIcon;
