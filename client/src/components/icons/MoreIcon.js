import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const MoreIcon = ({ width = 24, height = 24, type }) => {
  const vertical = (
    <Fragment>
      <circle cx='12' cy='12' r='1'></circle>
      <circle cx='12' cy='5' r='1'></circle>
      <circle cx='12' cy='19' r='1'></circle>
    </Fragment>
  );

  const horizontal = (
    <Fragment>
      <circle cx='12' cy='12' r='1'></circle>
      <circle cx='19' cy='12' r='1'></circle>
      <circle cx='5' cy='12' r='1'></circle>
    </Fragment>
  );

  // returns a default of vertical more icon unless specified
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
      className='icon more-icon'
    >
      {type === 'horizontal' ? horizontal : vertical}
    </svg>
  );
};

MoreIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  type: PropTypes.oneOf(['horizontal', 'vertical']),
};

export default MoreIcon;
