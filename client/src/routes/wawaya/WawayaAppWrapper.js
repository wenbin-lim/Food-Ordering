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
    getCompanies();

    // eslint-disable-next-line
  }, []);

  const navbarLeftContent = (
    <Fragment>
      <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
      {!screenOrientation && (
        <Fragment>
          <NavLink
            to='companies'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            Companies
          </NavLink>
          <NavLink
            to='users'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            Users
          </NavLink>
          <NavLink
            to='tables'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            Tables
          </NavLink>
          <NavLink
            to='menus'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            Menus
          </NavLink>
          <NavLink
            to='foods'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            Foods
          </NavLink>
          <NavLink
            to='customisations'
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            Customisations
          </NavLink>
        </Fragment>
      )}
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
            {
              name: 'Companies',
              path: 'companies',
            },
            {
              name: 'Users',
              path: 'users',
            },
            {
              name: 'Tables',
              path: 'tables',
            },
            {
              name: 'Menus',
              path: 'menus',
            },
            {
              name: 'Foods',
              path: 'foods',
            },
            {
              name: 'Customisations',
              path: 'customisations',
            },
          ]}
          unmountSidebarHandler={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
    </Fragment>
  );
};

WawayaAppWrapper.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  getCompanies: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  logout,
  getCompanies,
};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaAppWrapper);
