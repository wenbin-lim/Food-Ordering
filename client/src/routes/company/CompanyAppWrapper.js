import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import Button from '../../components/layout/Button';

// Icons
import BellIcon from '../../components/icons/BellIcon';
import HomeIcon from '../../components/icons/HomeIcon';
import FoodMenuIcon from '../../components/icons/FoodMenuIcon';
import FoodTableIcon from '../../components/icons/FoodTableIcon';
import FoodOrderIcon from '../../components/icons/FoodOrderIcon';
import FoodBillIcon from '../../components/icons/FoodBillIcon';
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
export const CompanyAppWrapper = ({ auth: { company, auth }, logout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationMatch = link => {
    return location.pathname === `/${company.name}/${link}`;
  };

  const menuNavItem = (
    <Button
      icon={<FoodMenuIcon active={locationMatch('menu')} />}
      onClick={() => navigate(`menu`)}
    />
  );

  const adminNavItem = (
    <Button
      icon={<HomeIcon active={locationMatch('admin')} />}
      onClick={() => navigate(`admin`)}
    />
  );

  const tablesNavItem = (
    <Button
      icon={<FoodTableIcon active={locationMatch('tables')} />}
      onClick={() => navigate(`tables`)}
    />
  );

  const ordersNavItem = (
    <Button
      icon={<FoodOrderIcon active={locationMatch('orders')} />}
      onClick={() => navigate(`orders`)}
    />
  );

  const billsNavItem = (
    <Button
      icon={<FoodBillIcon active={locationMatch('bills')} />}
      onClick={() => navigate(`bills`)}
    />
  );

  const notificationsNavItem = (
    <Button
      icon={<BellIcon active={locationMatch('notifications')} />}
      onClick={() => navigate(`notifications`)}
    />
  );

  const logoutNavItem = (
    <Button icon={<LogoutIcon />} onClick={() => logout()} />
  );

  const navbarLeftContent = (
    <Fragment>
      <img
        className='navbar-logo invert-in-dark-mode'
        src={company ? company.logo.small : company.logo.large}
        alt='logo'
        onClick={() => navigate('')}
      />
    </Fragment>
  );

  const navbarRightContent = (
    <Fragment>
      {logoutNavItem}
      {auth.role.indexOf('admin') >= 0 ? notificationsNavItem : null}
    </Fragment>
  );

  const bottomNavItems = (
    <Fragment>
      {menuNavItem}
      {auth.role.indexOf('admin') >= 0 ? (
        <Fragment>
          {adminNavItem}
          {tablesNavItem}
          {ordersNavItem}
          {billsNavItem}
        </Fragment>
      ) : (
        <Fragment>
          {auth.role.indexOf('waiter') >= 0 ? tablesNavItem : null}
          {auth.role.indexOf('kitchen') >= 0 ? ordersNavItem : null}
          {auth.role.indexOf('cashier') >= 0 ? billsNavItem : null}
          {notificationsNavItem}
        </Fragment>
      )}
    </Fragment>
  );

  return (
    <div className='app-wrapper'>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={navbarRightContent}
      />
      <Outlet />
      <BottomNav navItems={bottomNavItems} />
    </div>
  );
};

CompanyAppWrapper.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAppWrapper);
