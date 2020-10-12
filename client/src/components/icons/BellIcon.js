import React from 'react';
import PropTypes from 'prop-types';

// Misc
import { v4 as uuid } from 'uuid';

const BellIcon = ({
  width = 24,
  height = 24,
  active = false,
  showAlert = false,
}) => {
  const maskId = uuid();

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      className='icon bell-icon'
    >
      {showAlert && (
        <defs>
          <mask id={maskId}>
            <rect width='100%' height='100%' fill='white' />
            <circle cx='20' cy='4' r='6' fill='black' />
          </mask>
        </defs>
      )}
      <path
        d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'
        fill='none'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        mask={showAlert ? `url(#${maskId})` : null}
      />
      <path
        d='M13.73 21a2 2 0 0 1-3.46 0'
        fill='none'
        stroke={active ? 'var(--secondary)' : 'currentColor'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        mask={showAlert ? `url(#${maskId})` : null}
      />

      {showAlert && <circle cx='20' cy='4' r='4' fill='var(--error)' />}
    </svg>
  );
};

BellIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  active: PropTypes.bool,
  showAlert: PropTypes.bool,
};

export default BellIcon;
