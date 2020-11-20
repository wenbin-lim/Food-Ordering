import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

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
import FoodTableIcon from '../../components/icons/FoodTableIcon';
import FoodOrderIcon from '../../components/icons/FoodOrderIcon';
import FoodBillIcon from '../../components/icons/FoodBillIcon';
import LogoutIcon from '../../components/icons/LogoutIcon';

import UsersIcon from '../../components/icons/UsersIcon';
import TableIcon from '../../components/icons/TableIcon';
import FlipBookIcon from '../../components/icons/FlipBookIcon';
import FoodIcon from '../../components/icons/FoodIcon';
import FoodCustomisationIcon from '../../components/icons/FoodCustomisationIcon';

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
  const { socialMediaLinks, logo: companyLogos } = companyDetails;
  const { small: companyLogoSmall, large: companyLogoLarge } = {
    ...companyLogos,
  };

  const { data: menus } = useGet('menus', {
    route: '/api/menus',
    params: { company },
    enabled: company,
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
        </Navbar.Left>
        <Navbar.Right>
          <Button icon={<LogoutIcon />} onClick={logout} />
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
            justifyContent={userAccess === 3 ? 'start' : 'center'}
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
            {userAccess === 3 && <SideBarDivider />}
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
          <BottomNavLink to='waiter' icon={<FoodTableIcon />} />
        )}
        {(userAccess === 3 || userRole.indexOf('kitchen') >= 0) && (
          <BottomNavLink to='kitchen' icon={<FoodOrderIcon />} />
        )}
        {(userAccess === 3 || userRole.indexOf('cashier') >= 0) && (
          <BottomNavLink to='cashier' icon={<FoodBillIcon />} />
        )}
        <BottomNavLink to='notifications' icon={<BellIcon />} />
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
