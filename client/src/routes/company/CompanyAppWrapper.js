import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import BottomNav from '../../components/layout/BottomNav';
import Button from '../../components/layout/Button';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import BellIcon from '../../components/icons/BellIcon';
import HomeIcon from '../../components/icons/HomeIcon';
import FoodTableIcon from '../../components/icons/FoodTableIcon';
import FoodOrderIcon from '../../components/icons/FoodOrderIcon';
import FoodBillIcon from '../../components/icons/FoodBillIcon';
import LogoutIcon from '../../components/icons/LogoutIcon';

// Actions
import { logout } from '../../actions/auth';
import { getMenus } from '../../actions/menus';
import { getFoods } from '../../actions/foods';

export const CompanyAppWrapper = ({
  auth: { company, auth },
  menus,
  logout,
  getMenus,
  getFoods,
}) => {
  const { role: authRole } = auth;
  const { _id: companyId, name: companyName, socialMediaLinks } = company;

  const location = useLocation();
  const navigate = useNavigate();

  const locationMatch = link => {
    return location.pathname === `/${companyName}/${link}`;
  };

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

  const bottomNavItems = (
    <Fragment>
      {authRole.indexOf('admin') >= 0 ? (
        <Fragment>
          {adminNavItem}
          {tablesNavItem}
          {ordersNavItem}
          {billsNavItem}
        </Fragment>
      ) : (
        <Fragment>
          {authRole.indexOf('waiter') >= 0 ? tablesNavItem : null}
          {authRole.indexOf('kitchen') >= 0 ? ordersNavItem : null}
          {authRole.indexOf('cashier') >= 0 ? billsNavItem : null}
        </Fragment>
      )}
      {notificationsNavItem}
    </Fragment>
  );

  useEffect(() => {
    getMenus(companyId);
    getFoods(companyId);

    // eslint-disable-next-line
  }, []);

  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarHeader = company.logo && (
    <img
      className='sidebar-logo invert-in-dark-mode'
      src={company.logo.large ? company.logo.large : company.logo.small}
      alt='logo'
    />
  );

  const sidebarLinks = [
    {
      name: 'Main Menu',
      link: 'menus',
    },
    ...menus.map(menu => ({
      name: menu.name,
      link: `menus/${menu._id}`,
    })),
  ];

  return (
    <Fragment>
      <Navbar
        leftContent={
          <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
        }
        rightContent={<Button icon={<LogoutIcon />} onClick={() => logout()} />}
      />
      {showSidebar && (
        <Sidebar
          headerContent={sidebarHeader}
          sidebarLinks={sidebarLinks}
          socialMediaLinks={socialMediaLinks}
          unmountSidebarHandler={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
      <BottomNav navItems={bottomNavItems} />
    </Fragment>
  );
};

CompanyAppWrapper.propTypes = {
  auth: PropTypes.object.isRequired,
  menus: PropTypes.array.isRequired,
  logout: PropTypes.func.isRequired,
  getMenus: PropTypes.func.isRequired,
  getFoods: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus.menus,
});

const mapDispatchToProps = {
  logout,
  getMenus,
  getFoods,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAppWrapper);
