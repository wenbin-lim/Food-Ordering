import React, { useState, useEffect, useRef, Children } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Navbar = ({ className, children, ...rest }) => {
  const navbarRef = useRef(null);
  const [centerPresent, setCenterPresent] = useState(false);

  useEffect(() => {
    const navbar = navbarRef.current;

    if (navbar) {
      document.documentElement.style.setProperty(
        '--navbar-height',
        `${navbar.offsetHeight}px`
      );
    }

    let foundCenter = false;
    Children.forEach(children, child => {
      if (child?.type === Center) {
        foundCenter = true;
      }
    });
    setCenterPresent(foundCenter);

    return () => {
      document.documentElement.style.setProperty('--navbar-height', '0px');
    };
  }, [children]);

  return (
    <nav
      className={sanitizeWhiteSpace(
        `navbar ${centerPresent ? 'navbar-center-present' : ''} ${
          className ? className : ''
        }`
      )}
      ref={navbarRef}
      {...rest}
    >
      {Children.map(
        children,
        child =>
          (child?.type === Left ||
            child?.type === Center ||
            child?.type === Right) &&
          child
      )}
    </nav>
  );
};

Navbar.propTypes = {
  className: PropTypes.string,
};

const Left = ({ className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `navbar-left ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

Left.propTypes = {
  className: PropTypes.string,
};

const Center = ({ className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `navbar-center ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

Center.propTypes = {
  className: PropTypes.string,
};

const Right = ({ className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `navbar-right ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

Right.propTypes = {
  className: PropTypes.string,
};

export const NavbarLogo = ({ logo, to, onClick, invertInDarkMode = true }) => {
  const navigate = useNavigate();

  const onClickLogo = () => {
    if (typeof onClick === 'function') {
      onClick();
    } else if (typeof to === 'string') {
      navigate(to);
    }
  };

  return (
    <img
      className={sanitizeWhiteSpace(
        `navbar-logo ${invertInDarkMode ? 'invert-in-dark-mode' : ''}`
      )}
      src={logo}
      alt={'navbar-logo'}
      onClick={onClickLogo}
    />
  );
};

Navbar.Left = Left;
Navbar.Center = Center;
Navbar.Right = Right;

export default Navbar;
