import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  matchPath,
} from 'react-router-dom';

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

import UsersIcon from '../../components/icons/UsersIcon';
import TableIcon from '../../components/icons/TableIcon';
import FlipBookIcon from '../../components/icons/FlipBookIcon';
import FoodIcon from '../../components/icons/FoodIcon';
import FoodCustomisationIcon from '../../components/icons/FoodCustomisationIcon';

// Actions
import { logout } from '../../actions/auth';
import { getMenus } from '../../actions/menus';

const CompanyAppWrapper = ({
  userCompany,
  userAccess,
  userRole,
  userCompanyName,
  userCompanyId,
  menus: { menusLoading, menus },
  screenOrientation,
  logout,
  getMenus,
}) => {
  const {
    socialMediaLinks,
    logo: { small: logoSmall, large: logoLarge } = {},
  } = userCompany;

  const location = useLocation();
  const navigate = useNavigate();

  const locationMatch = link =>
    matchPath(
      {
        path: `${userCompanyName}/${link}`,
        end: false,
      },
      location.pathname
    )
      ? true
      : false;

  const adminNavLinks = [
    {
      name: 'users',
      path: 'users',
      icon: <UsersIcon />,
    },
    {
      name: 'tables',
      path: 'tables',
      icon: <TableIcon />,
    },
    {
      name: 'menus',
      path: 'menus',
      icon: <FlipBookIcon />,
    },
    {
      name: 'foods',
      path: 'foods',
      icon: <FoodIcon />,
    },
    {
      name: 'customisations',
      path: 'customisations',
      icon: <FoodCustomisationIcon />,
    },
  ];

  const navbarLeftContent = (
    <Fragment>
      <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
      {!screenOrientation &&
        userAccess === 3 &&
        adminNavLinks.map((link, index) => (
          <NavLink
            key={`adminnavlink_to_${link.name}_${index}`}
            to={link.path}
            className='navbar-link button-text'
            activeClassName='navbar-link-active'
          >
            {link.name}
          </NavLink>
        ))}
    </Fragment>
  );

  const bottomNavLinks = [
    {
      role: 'admin',
      path: 'admin',
      icon: <HomeIcon active={locationMatch('admin')} />,
    },
    {
      role: 'waiter',
      path: 'waiter',
      icon: <FoodTableIcon active={locationMatch('waiter')} />,
    },
    {
      role: 'kitchen',
      path: 'kitchen',
      icon: <FoodOrderIcon active={locationMatch('orders')} />,
    },
    {
      role: 'cashier',
      path: 'cashier',
      icon: <FoodBillIcon active={locationMatch('bills')} />,
    },
  ];

  const bottomNavItems = (
    <Fragment>
      {bottomNavLinks.map(
        (link, index) =>
          (userAccess === 3 || userRole.indexOf(link.role) >= 0) && (
            <Button
              key={`bottomnavlink_to_${link.name}_${index}`}
              icon={link.icon}
              onClick={() => navigate(link.path)}
            />
          )
      )}
      <Button
        icon={<BellIcon active={locationMatch('notifications')} />}
        onClick={() => navigate(`notifications`)}
      />
    </Fragment>
  );

  useEffect(() => {
    getMenus(userCompanyId);

    // eslint-disable-next-line
  }, []);

  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  const sidebarHeader = (
    <Fragment>
      {(logoSmall || logoLarge) && (
        <img
          className='sidebar-logo invert-in-dark-mode'
          src={logoLarge ? logoLarge : logoSmall}
          alt='logo'
          onClick={() =>
            sidebarRef.current && sidebarRef.current.closeSidebar('')
          }
        />
      )}
    </Fragment>
  );

  const sidebarLinks =
    !menusLoading && Array.isArray(menus)
      ? [
          ...(userAccess === 3 &&
            adminNavLinks.map(link => ({
              icon: link.icon,
              name: link.name,
              path: link.path,
            }))),
          userAccess === 3 && {
            divider: true,
          },
          {
            name: 'Main Menu',
            path: 'menu',
          },
          ...menus
            .filter(menu => menu.availability)
            .map(menu => ({
              name: menu.name,
              path: `menu/${menu._id}`,
            })),
        ]
      : [];

  return (
    <Fragment>
      <Navbar
        leftContent={navbarLeftContent}
        rightContent={<Button icon={<LogoutIcon />} onClick={() => logout()} />}
      />
      {showSidebar && (
        <Sidebar
          ref={sidebarRef}
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
  userCompany: PropTypes.object.isRequired,
  userAccess: PropTypes.number.isRequired,
  userRole: PropTypes.array.isRequired,
  userCompanyName: PropTypes.string.isRequired,
  userCompanyId: PropTypes.string.isRequired,
  menus: PropTypes.object.isRequired,
  screenOrientation: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  getMenus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  logout,
  getMenus,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAppWrapper);
