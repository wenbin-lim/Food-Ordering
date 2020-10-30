import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const BottomNav = ({ navItems, classes, style }) => {
  const bottomNavRef = useRef(null);

  useLayoutEffect(() => {
    const bottomNav = bottomNavRef.current;

    if (bottomNav) {
      document.documentElement.style.setProperty(
        '--bottomnav-height',
        `${bottomNav.offsetHeight}px`
      );
    }

    return () => {
      document.documentElement.style.setProperty('--bottomnav-height', '0px');
    };
  }, [navItems]);

  return (
    <nav
      className={sanitizeWhiteSpace(`bottom-nav ${classes ? classes : ''}`)}
      style={style}
      ref={bottomNavRef}
    >
      {navItems && <section className='bottom-nav-items'>{navItems}</section>}
    </nav>
  );
};

BottomNav.propTypes = {
  navItems: PropTypes.element,
};

export default BottomNav;
