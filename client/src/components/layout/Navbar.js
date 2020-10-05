// eslint-disable-next-line
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Router
// eslint-disable-next-line
import { Link, useNavigate } from 'react-router-dom';

// actions
import { logout } from '../../actions/auth';

// Components
import Button from './Button';
import Sidebar from './Sidebar';

// Icons
import LogoutIcon from '../icons/LogoutIcon';
import MenuIcon from '../icons/MenuIcon';

// Assets
import logo from '../../assets/logo.png';

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
  @desc       redux action function from auth to logout user
  @required   true

  ============
  Boilerplates
  ============
  // Links
  <Link to='/login' className='nav-link'>
    Login
  </Link>

  // Button Icons
  <button className='btn-icon'>
      <LogoutIcon />
  </button>

  // Navbar Logo
  <div className='nav-logo' onClick={() => navigate('/')}>
    <img src={logo} alt='Logo' />
  </div>
*/
export const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  let navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Fragment>
      <nav className='navbar'>
        <section className='navbar-left'>
          <Button
            icon={<MenuIcon />}
            additionalClasses={'sidebar-toggle'}
            onClick={() => setSidebarOpen(true)}
          />
        </section>
        <section className='navbar-center hide-in-portrait'>
          <div className='nav-logo' onClick={() => navigate('/')}>
            <img className='logo invert-in-dark-mode' src={logo} alt='Logo' />
          </div>
        </section>
        <section className='navbar-right'>
          {!loading && isAuthenticated && (
            <Button icon={<LogoutIcon />} onClick={() => logout()} />
          )}
        </section>
      </nav>
      {sidebarOpen && <Sidebar unmountSidebar={() => setSidebarOpen(false)} />}
    </Fragment>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
