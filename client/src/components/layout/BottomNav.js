import React, { useEffect, useRef, Children } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const BottomNav = ({ className, children, ...rest }) => {
  const bottomNavRef = useRef(null);

  useEffect(() => {
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
  }, [children]);

  return (
    <nav
      className={sanitizeWhiteSpace(`bottom-nav ${className ? className : ''}`)}
      ref={bottomNavRef}
      {...rest}
    >
      <section className='bottom-nav-links'>
        {Children.map(children, child =>
          child?.type === BottomNavLink ? child : null
        )}
      </section>
    </nav>
  );
};

BottomNav.propTypes = {
  className: PropTypes.string,
};

export const BottomNavLink = ({ to, name, icon }) => {
  return (
    <NavLink to={to} className={'bottom-nav-link'} activeClassName='active'>
      {icon && <div className='bottom-nav-link-icon'>{icon}</div>}
      {name && <div className='bottom-nav-link-name'>{name}</div>}
    </NavLink>
  );
};

BottomNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  name: PropTypes.string,
  icon: PropTypes.element,
};

export default BottomNav;
