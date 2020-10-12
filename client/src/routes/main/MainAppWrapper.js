import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/layout/Button';
import Sidebar from '../../components/layout/Sidebar';

// Assets
import WawayaLogoLarge from '../../assets/wawaya_logo_large.png';
import WawayaLogoSmall from '../../assets/wawaya_logo_small.png';

/* 
  =====
  Props
  =====
  @name       screenOrientation 
  @type       boolean
  @desc       determines if app is portrait or landscape mode
  @required   true
*/
export const MainAppWrapper = ({ screenOrientation }) => {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);

  const navbarLeftContent = (
    <Fragment>
      <img
        className='navbar-logo invert-in-dark-mode'
        src={WawayaLogoSmall}
        alt='logo'
        onClick={() => {
          if (screenOrientation) {
            setShowSidebar(true);
          } else {
            navigate('/');
          }
        }}
      />
      {!screenOrientation && (
        <Fragment>
          <NavLink
            to='/ordernow'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            ORDER
          </NavLink>
          <NavLink
            to='/about'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            ABOUT
          </NavLink>
          <NavLink
            to='/contact'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            CONTACT
          </NavLink>
        </Fragment>
      )}
    </Fragment>
  );

  const navbarRightContent = (
    <NavLink
      to='/login'
      className='navbar-link button-text'
      activeClassName='navbar-link-active'
    >
      LOGIN
    </NavLink>
  );

  const sidebarHeader = (
    <Fragment>
      <img
        className='invert-in-dark-mode'
        src={WawayaLogoLarge}
        alt='logo'
        style={{
          maxWidth: '100%',
          height: '48px',
        }}
      />
    </Fragment>
  );

  return (
    <div className='app-wrapper'>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={navbarRightContent}
      />
      {screenOrientation && showSidebar && (
        <Sidebar
          headerContent={sidebarHeader}
          sidebarLinks={[
            {
              name: 'HOME',
              link: '/',
            },
            {
              name: 'ORDER',
              link: '/ordernow',
            },
            {
              name: 'ABOUT',
              link: '/about',
            },
            {
              name: 'CONTACT',
              link: '/contact',
            },
          ]}
          socialMediaLinks={{
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
          }}
          unmountSidebar={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
    </div>
  );
};

MainAppWrapper.propTypes = {
  screenOrientation: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainAppWrapper);
