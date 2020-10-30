import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

// Assets
import WawayaLogoLarge from '../../assets/wawaya_logo_large.png';
import WawayaLogoSmall from '../../assets/wawaya_logo_small.png';
import Container from '../../components/layout/Container';

const MainAppWrapper = ({ screenOrientation }) => {
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);

  const navbarLeftContent = (
    <Fragment>
      <img
        className='navbar-logo'
        src={WawayaLogoSmall}
        alt='navbar-logo'
        onClick={() =>
          !screenOrientation ? setShowSidebar(true) : navigate('/')
        }
      />
      <NavLink
        to='/about'
        className='navbar-link'
        activeClassName='navbar-link-active'
      >
        ABOUT
      </NavLink>
      <NavLink
        to='/contact'
        className='navbar-link'
        activeClassName='navbar-link-active'
      >
        CONTACT
      </NavLink>
    </Fragment>
  );

  const navbarRightContent = (
    <NavLink
      to='/login'
      className='navbar-link'
      activeClassName='navbar-link-active'
    >
      LOGIN
    </NavLink>
  );

  const sidebarHeader = (
    <Fragment>
      <img className='sidebar-logo' src={WawayaLogoLarge} alt='sidebar-logo' />
    </Fragment>
  );

  return (
    <div className='app-wrapper'>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={navbarRightContent}
      />
      {!screenOrientation && showSidebar && (
        <Sidebar
          headerContent={sidebarHeader}
          sidebarLinks={[
            {
              name: 'HOME',
              path: '/',
            },
            {
              name: 'ABOUT',
              path: '/about',
            },
            {
              name: 'CONTACT',
              path: '/contact',
            },
          ]}
          socialMediaLinks={{
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
          }}
          unmountSidebarHandler={() => setShowSidebar(false)}
        />
      )}
      <Container parentContent={<Outlet />} />
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
