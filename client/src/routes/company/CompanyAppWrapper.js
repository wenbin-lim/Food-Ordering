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
export const CompanyAppWrapper = ({ auth: { company, user }, logout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationMatch = link => {
    return location.pathname === `/${company.name}/${link}`;
  };

  const menuNavItem = (
    <Button
      icon={<FoodMenuIcon active={locationMatch('menu')} />}
      onClick={() => navigate(`/${company.name}/menu`)}
    />
  );

  const adminNavItem = (
    <Button
      icon={<HomeIcon active={locationMatch('admin')} />}
      onClick={() => navigate(`/${company.name}/admin`)}
    />
  );

  const tablesNavItem = (
    <Button
      icon={<FoodTableIcon active={locationMatch('tables')} />}
      onClick={() => navigate(`/${company.name}/tables`)}
    />
  );

  const ordersNavItem = (
    <Button
      icon={<FoodOrderIcon active={locationMatch('orders')} />}
      onClick={() => navigate(`/${company.name}/orders`)}
    />
  );

  const billsNavItem = (
    <Button
      icon={<FoodBillIcon active={locationMatch('bills')} />}
      onClick={() => navigate(`/${company.name}/bills`)}
    />
  );

  const notificationsNavItem = (
    <Button
      icon={<BellIcon active={locationMatch('notifications')} />}
      onClick={() => navigate(`/${company.name}/notifications`)}
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

  const navbarRightContent = user ? (
    <Fragment>
      {logoutNavItem}
      {user.role.indexOf('admin') >= 0 ? notificationsNavItem : null}
    </Fragment>
  ) : null;

  const bottomNavItems = user ? (
    <Fragment>
      {menuNavItem}
      {user.role.indexOf('admin') >= 0 ? (
        <Fragment>
          {adminNavItem}
          {tablesNavItem}
          {ordersNavItem}
          {billsNavItem}
        </Fragment>
      ) : (
        <Fragment>
          {user.role.indexOf('waiter') >= 0 ? tablesNavItem : null}
          {user.role.indexOf('kitchen') >= 0 ? ordersNavItem : null}
          {user.role.indexOf('cashier') >= 0 ? billsNavItem : null}
          {notificationsNavItem}
        </Fragment>
      )}
    </Fragment>
  ) : null;

  return user ? (
    <div className='app-wrapper'>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={navbarRightContent}
      />
      <Outlet />
      <BottomNav navItems={bottomNavItems} />
    </div>
  ) : (
    <Outlet />
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
