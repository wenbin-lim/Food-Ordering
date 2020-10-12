import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/* 
  =====
  Props
  =====
  @name       navItems 
  @type       jxs
  @desc       nav items
  @required   false
*/
export const BottomNav = ({
  navItems,
  additionalStyles,
  additionalClasses,
}) => {
  useEffect(() => {
    /* Functions to run on mount */
    document.documentElement.style.setProperty(
      '--container-bottom-padding',
      `0`
    );

    return () => {
      /* Functions to run before unmount */
      document.documentElement.style.setProperty(
        '--container-bottom-padding',
        `env(safe-area-inset-bottom)`
      );
    };
    // eslint-disable-next-line
  }, []);

  return (
    <nav
      className={`bottom-nav ${
        additionalClasses ? additionalClasses : ''
      }`.trim()}
      style={additionalStyles}
    >
      {navItems && <section className='bottom-nav-items'>{navItems}</section>}
    </nav>
  );
};

BottomNav.propTypes = {
  navItems: PropTypes.element,
};

export default BottomNav;
