import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar, {
  SidebarLogo,
  SidebarLink,
  SideBarDivider,
} from '../../components/layout/Sidebar';
import SocialMediaButtons from '../../components/layout/SocialMediaButtons';
import BottomNav, { BottomNavLink } from '../../components/layout/BottomNav';
import Button from '../../components/layout/Button';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import BellIcon from '../../components/icons/BellIcon';
import HomeIcon from '../../components/icons/HomeIcon';
import LogoutIcon from '../../components/icons/LogoutIcon';
import SettingIcon from '../../components/icons/SettingIcon';

import UsersIcon from '../../components/icons/UsersIcon';
import TableIcon from '../../components/icons/TableIcon';
import FlipBookIcon from '../../components/icons/FlipBookIcon';
import FoodIcon from '../../components/icons/FoodIcon';
import FoodCustomisationIcon from '../../components/icons/FoodCustomisationIcon';
import ReceiptIcon from '../../components/icons/ReceiptIcon';
import DiscountIcon from '../../components/icons/DiscountIcon';
import MessageIcon from '../../components/icons/MessageIcon';

import WaiterIcon from '../../components/icons/WaiterIcon';
import KitchenIcon from '../../components/icons/KitchenIcon';
import CashierIcon from '../../components/icons/CashierIcon';

// Hooks
import useGet from '../../query/hooks/useGet';

// Actions
import { logout } from '../../actions/auth';

const CompanyAppWrapper = ({
  user: { access: userAccess, role: userRole },
  company,
  companyDetails,
  screenOrientation,
  logout,
}) => {
  const navigate = useNavigate();
  const { socialMediaLinks, logo: companyLogos } = companyDetails;
  const { small: companyLogoSmall, large: companyLogoLarge } = {
    ...companyLogos,
  };

  const { data: menus } = useGet('menus', {
    route: '/api/menus',
    params: { company },
    enabled: company,
  });

  const { data: notifications } = useGet('notifications', {
    route: '/api/notifications',
    params: { company },
    refetchInterval: 10000,
    enabled:
      company &&
      (userAccess === 3 ||
        userRole.indexOf('waiter') >= 0 ||
        userRole.indexOf('cashier') >= 0),
  });

  const [showSidebar, setShowSidebar] = useState(false);

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
    {
      name: 'bills',
      path: 'bills',
      icon: <ReceiptIcon />,
    },
    {
      name: 'discounts',
      path: 'discounts',
      icon: <DiscountIcon />,
    },
    // {
    //   name: 'feedbacks',
    //   path: 'feedbacks',
    //   icon: <MessageIcon />,
    // },
  ];

  const kitchenNavLinks = [
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

  const cashierNavLinks = [
    {
      name: 'bills',
      path: 'bills',
      icon: <ReceiptIcon />,
    },
  ];

  return (
    <Fragment>
      <Navbar>
        <Navbar.Left>
          <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
          {!screenOrientation &&
            userAccess === 3 &&
            adminNavLinks.map(({ name, path }, index) => (
              <NavLink
                key={`adminnavlink_to_${name}_${index}`}
                to={path}
                className='navbar-link'
                activeClassName='active'
              >
                {name}
              </NavLink>
            ))}
          {!screenOrientation &&
            userAccess < 3 &&
            userRole.indexOf('kitchen') >= 0 &&
            kitchenNavLinks.map(({ name, path }, index) => (
              <NavLink
                key={`kitchennavlink_to_${name}_${index}`}
                to={path}
                className='navbar-link'
                activeClassName='active'
              >
                {name}
              </NavLink>
            ))}
          {!screenOrientation &&
            userAccess < 3 &&
            userRole.indexOf('cashier') >= 0 &&
            cashierNavLinks.map(({ name, path }, index) => (
              <NavLink
                key={`cashiernavlink_to_${name}_${index}`}
                to={path}
                className='navbar-link'
                activeClassName='active'
              >
                {name}
              </NavLink>
            ))}
        </Navbar.Left>
        <Navbar.Right>
          <Button icon={<LogoutIcon />} onClick={logout} />
          {(userAccess === 3 ||
            userRole.indexOf('waiter') >= 0 ||
            userRole.indexOf('cashier') >= 0) && (
            <Button
              icon={
                <BellIcon
                  showAlert={
                    Array.isArray(notifications) && notifications.length > 0
                  }
                />
              }
              onClick={() => navigate('notifications')}
            />
          )}
        </Navbar.Right>
      </Navbar>

      {showSidebar && (
        <Sidebar onCloseSidebar={() => setShowSidebar(false)}>
          <Sidebar.Header>
            {(companyLogoLarge || companyLogoSmall) && (
              <SidebarLogo
                to=''
                logo={companyLogoLarge ? companyLogoLarge : companyLogoSmall}
              />
            )}
          </Sidebar.Header>
          <Sidebar.Content
            justifyContent={
              userAccess === 3 ||
              userRole.indexOf('kitchen') >= 0 ||
              userRole.indexOf('cashier') >= 0
                ? 'start'
                : 'center'
            }
          >
            {userAccess === 3 &&
              adminNavLinks.map(({ name, icon, path }, index) => (
                <SidebarLink
                  key={`sidebaradminlink_to_${name}_${index}`}
                  to={path}
                  name={name}
                  icon={icon}
                />
              ))}
            {userAccess < 3 &&
              userRole.indexOf('kitchen') >= 0 &&
              kitchenNavLinks.map(({ name, icon, path }, index) => (
                <SidebarLink
                  key={`sidebarkitchenlink_to_${name}_${index}`}
                  to={path}
                  name={name}
                  icon={icon}
                />
              ))}
            {userAccess < 3 &&
              userRole.indexOf('cashier') >= 0 &&
              cashierNavLinks.map(({ name, icon, path }, index) => (
                <SidebarLink
                  key={`sidebarcashierlink_to_${name}_${index}`}
                  to={path}
                  name={name}
                  icon={icon}
                />
              ))}
            {(userAccess === 3 ||
              userRole.indexOf('kitchen') >= 0 ||
              userRole.indexOf('cashier') >= 0) && <SideBarDivider />}
            <SidebarLink to='menu' name={'Main Menu'} />
            {Array.isArray(menus) &&
              menus.map(({ _id: menuId, name }) => (
                <SidebarLink key={menuId} to={`menu/${menuId}`} name={name} />
              ))}
          </Sidebar.Content>
          <Sidebar.Footer>
            <SocialMediaButtons socialMediaLinks={socialMediaLinks} />
          </Sidebar.Footer>
        </Sidebar>
      )}

      <Outlet />

      <BottomNav>
        {userAccess === 3 && <BottomNavLink to='admin' icon={<HomeIcon />} />}
        {(userAccess === 3 || userRole.indexOf('waiter') >= 0) && (
          <BottomNavLink to='waiter' icon={<WaiterIcon />} />
        )}
        {(userAccess === 3 || userRole.indexOf('kitchen') >= 0) && (
          <BottomNavLink to='kitchen' icon={<KitchenIcon />} />
        )}
        {(userAccess === 3 || userRole.indexOf('cashier') >= 0) && (
          <BottomNavLink to='cashier' icon={<CashierIcon />} />
        )}
        {userAccess === 3 && (
          <BottomNavLink to='settings' icon={<SettingIcon />} />
        )}
      </BottomNav>
    </Fragment>
  );
};

CompanyAppWrapper.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
  companyDetails: PropTypes.object,
  screenOrientation: PropTypes.bool,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAppWrapper);
