import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/layout/Button';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import CartIcon from '../../components/icons/CartIcon';

/* 
  =====
  Props
  =====
  @name       company 
  @type       object
  @desc       company object from CustomerRoute
  @required   true
*/
export const CustomerAppWrapper = ({ company, auth }) => {
  // is location matching routes after /ordernow/:companyname/table
  // if match => menuicon and carticon required
  // not match => menuicon and carticon not required
  let match = useMatch({
    path: `/ordernow/${company.name}/table/:route`,
  });

  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);

  const navbarLeftContent = match ? (
    <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
  ) : (
    <img
      className='navbar-logo invert-in-dark-mode'
      src={company ? company.logo.small : company.logo.large}
      alt='logo'
      onClick={() => navigate('')}
    />
  );

  const navbarRightContent = match && (
    <Button icon={<CartIcon />} onClick={() => navigate('table/cart')} />
  );

  const sidebarHeader = (
    <Fragment>
      <img
        className='invert-in-dark-mode'
        src={company ? company.logo.large : company.logo.small}
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
      {match && showSidebar && (
        <Sidebar
          headerContent={sidebarHeader}
          sidebarLinks={[
            {
              name: 'menu',
              link: 'table/menu',
            },
          ]}
          socialMediaLinks={company && company.socialMediaLinks}
          unmountSidebar={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
    </div>
  );
};

CustomerAppWrapper.propTypes = {
  company: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerAppWrapper);
