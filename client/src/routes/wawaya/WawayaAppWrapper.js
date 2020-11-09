import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, NavLink } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/layout/Button';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import LogoutIcon from '../../components/icons/LogoutIcon';

// Actions
import { logout } from '../../actions/auth';
import { getCompanies } from '../../actions/companies';

const WawayaAppWrapper = ({ screenOrientation, logout, getCompanies }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // redux companies state is required in most routes
    // hence getCompanies here to start off
    // getCompanies();
    // eslint-disable-next-line
  }, []);

  const navLinks = [
    'companies',
    'users',
    'tables',
    'menus',
    'foods',
    'customisations',
  ];

  const navbarLeftContent = (
    <Fragment>
      <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
      {!screenOrientation &&
        navLinks.map((link, index) => (
          <NavLink
            key={`navlink-${link}-${index}`}
            to={link}
            className='navbar-link'
            activeClassName='active'
          >
            {link}
          </NavLink>
        ))}
    </Fragment>
  );

  return (
    <Fragment>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={<Button icon={<LogoutIcon />} onClick={() => logout()} />}
      />
      {showSidebar && (
        <Sidebar
          sidebarLinks={[
            {
              name: 'Dashboard',
              path: '',
            },
            ...navLinks.map(link => ({
              name: link,
              path: link,
            })),
          ]}
          unmountSidebarHandler={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
    </Fragment>
  );
};

WawayaAppWrapper.propTypes = {
  screenOrientation: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  getCompanies: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  logout,
  getCompanies,
};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaAppWrapper);
