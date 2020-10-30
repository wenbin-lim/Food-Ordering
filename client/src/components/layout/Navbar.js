import React, { useLayoutEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Navbar = ({
  classes = '',
  leftContent,
  centerContent,
  rightContent,
  style,
}) => {
  const navbarRef = useRef(null);

  useLayoutEffect(() => {
    const navbar = navbarRef.current;

    if (navbar) {
      document.documentElement.style.setProperty(
        '--navbar-height',
        `${navbar.offsetHeight}px`
      );
    }

    return () => {
      document.documentElement.style.setProperty('--navbar-height', '0px');
    };
  }, [leftContent, centerContent, rightContent]);

  return (
    <Fragment>
      <nav
        className={sanitizeWhiteSpace(
          `navbar ${centerContent ? 'navbar-center-present' : ''} ${classes}`
        )}
        style={style}
        ref={navbarRef}
      >
        {leftContent && (
          <section className='navbar-left'>{leftContent}</section>
        )}
        {centerContent && (
          <section className='navbar-center'>{centerContent}</section>
        )}
        {rightContent && (
          <section className='navbar-right'>{rightContent}</section>
        )}
      </nav>
    </Fragment>
  );
};

Navbar.propTypes = {
  classes: PropTypes.string,
  leftContent: PropTypes.element,
  centerContent: PropTypes.element,
  rightContent: PropTypes.element,
  style: PropTypes.object,
};

export default Navbar;
