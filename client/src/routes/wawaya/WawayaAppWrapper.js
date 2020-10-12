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

/* 
  =====
  Props
  =====
  @name       auth 
  @type       object
  @desc       app level auth state
  @required   true

  @name       logout 
  @type       function
  @desc       to logout user
  @required   true
*/
export const WawayaAppWrapper = ({ logout }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className='app-wrapper'>
      <Navbar
        leftContent={
          <Fragment>
            <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
            <NavLink
              to='companies'
              className='navbar-link button-text'
              activeClassName='navbar-link-active'
            >
              Companies
            </NavLink>
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
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaAppWrapper);
