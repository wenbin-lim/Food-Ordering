import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, NavLink } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar, { SidebarLink } from '../../components/layout/Sidebar';
import Button from '../../components/layout/Button';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import LogoutIcon from '../../components/icons/LogoutIcon';

// Actions
import { logout } from '../../actions/auth';

const WawayaAppWrapper = ({ screenOrientation, logout }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const navLinks = [
    'companies',
    'users',
    'tables',
    'menus',
    'foods',
    'customisations',
    'bills',
    'discounts',
    // 'feedbacks',
  ];

  return (
    <Fragment>
      <Navbar>
        <Navbar.Left>
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
        </Navbar.Left>
        <Navbar.Right>
          <Button icon={<LogoutIcon />} onClick={() => logout()} />
        </Navbar.Right>
      </Navbar>

      {showSidebar && (
        <Sidebar onCloseSidebar={() => setShowSidebar(false)}>
          <Sidebar.Content justifyContent='center'>
            <SidebarLink to={''} name={'Dashboard'} />
            {navLinks.map((link, index) => (
              <SidebarLink key={`${link}-${index}`} to={link} name={link} />
            ))}
          </Sidebar.Content>
          <Sidebar.Footer />
        </Sidebar>
      )}

      <Outlet />
    </Fragment>
  );
};

WawayaAppWrapper.propTypes = {
  screenOrientation: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaAppWrapper);
