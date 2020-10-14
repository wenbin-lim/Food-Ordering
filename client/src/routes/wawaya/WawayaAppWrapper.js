import React, { useState, useEffect, useRef, Fragment } from 'react';
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

/* 
  =====
  Props
  =====
  @name       screenOrientation 
  @type       boolean
  @desc       app level app state of screenOrientation
  @required   true

  @name       auth 
  @type       object
  @desc       app level auth state
  @required   true

  @name       logout 
  @type       function
  @desc       to logout user
  @required   true
*/
export const WawayaAppWrapper = ({
  screenOrientation,
  logout,
  getCompanies,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // redux companies state is required in most routes
    // hence getCompanies here to start off
    getCompanies();

    // eslint-disable-next-line
  }, []);

  return (
    <div className='app-wrapper'>
      <Navbar
        leftContent={
          <Fragment>
            <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
            {!screenOrientation && (
              <Fragment>
                <NavLink
                  to='random'
                  className='navbar-link button-text'
                  activeClassName='navbar-link-active'
                >
                  random
                </NavLink>
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
              </Fragment>
            )}
          </Fragment>
        }
        rightContent={<Button icon={<LogoutIcon />} onClick={() => logout()} />}
      />
      {showSidebar && (
        <Sidebar
          sidebarLinks={[
            {
              name: 'Dashboard',
              link: '',
            },
            {
              name: 'Companies',
              link: 'companies',
            },
          ]}
          unmountSidebar={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
    </div>
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
