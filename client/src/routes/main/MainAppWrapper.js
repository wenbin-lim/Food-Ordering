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

const MainAppWrapper = ({ screenOrientation }) => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const links = ['about', 'contact'];

  const navbarLeftContent = (
    <Fragment>
      <img
        className='navbar-logo'
        src={WawayaLogoSmall}
        alt='navbar-logo'
        onClick={() =>
          !screenOrientation ? navigate('/') : setShowSidebar(true)
        }
      />
      {!screenOrientation &&
        links.map((link, index) => (
          <NavLink
            key={`navlink-${link}-${index}`}
            to={`/${link}`}
            className='navbar-link'
            activeClassName='active'
          >
            {link}
          </NavLink>
        ))}
    </Fragment>
  );

  const navbarRightContent = (
    <NavLink to='/login' className='navbar-link' activeClassName='active'>
      LOGIN
    </NavLink>
  );

  const sidebarHeader = (
    <img
      className='sidebar-logo'
      src={WawayaLogoLarge}
      alt='sidebar-logo'
      onClick={() => navigate('/')}
    />
  );

  return (
    <Fragment>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={navbarRightContent}
      />
      {screenOrientation && showSidebar && (
        <Sidebar
          headerContent={sidebarHeader}
          sidebarLinks={links.map(link => ({ name: link, path: link }))}
          socialMediaLinks={{
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
          }}
          unmountSidebarHandler={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
    </Fragment>
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
