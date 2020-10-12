// eslint-disable-next-line
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

// Router
import { useNavigate } from 'react-router-dom';

// Components
import Button from './Button';
import Sidebar from './Sidebar';

// Icons
import MenuIcon from '../icons/MenuIcon';

/* 
  =====
  Props
  =====
  @name       logo
  @type       object of {large: String/Element, small: String/Element}
  @desc       small and large logo for navbar and sidebar
  @required   true

  @name       navbarLinks
  @type       jsx
  @desc       navbar links or icons on the navbar right
  @required   false

  @name       sidebarLinks
  @type       object of {name, link}
  @desc       sidebar links to redirect to
  @required   false

  @name       socialMediaLinks
  @type       object of {facebook, twitter, instagram: url string}
  @desc       facebook twitter instagram redirect links
  @required   false

  @name       additionalStyles
  @type       css style object
  @desc       change navbar style
  @desc       use to change color
  @required   false
*/
export const Navbar = ({
  leftContent,
  centerContent,
  rightContent,
  additionalClasses,
  additionalStyles,
}) => {
  return (
    <Fragment>
      <nav
        className={`navbar ${additionalClasses}`.trim()}
        style={additionalStyles}
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
  leftContent: PropTypes.element,
  leftContent: PropTypes.element,
  leftContent: PropTypes.element,
  additionalStyles: PropTypes.object,
};

export default Navbar;
