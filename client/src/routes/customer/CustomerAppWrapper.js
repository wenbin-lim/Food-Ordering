import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

// Components
import Navbar, { NavbarLogo } from '../../components/layout/Navbar';
import Sidebar, {
  SidebarLogo,
  SidebarLink,
} from '../../components/layout/Sidebar';
import Button from '../../components/layout/Button';
import SocialMediaButtons from '../../components/layout/SocialMediaButtons';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import CartIcon from '../../components/icons/CartIcon';

// Hooks
import useGetAll from '../../query/hooks/useGetAll';

const CustomerAppWrapper = ({ company, companyDetails }) => {
  const { socialMediaLinks, logo: companyLogos } = companyDetails;
  const { small: companyLogoSmall, large: companyLogoLarge } = {
    ...companyLogos,
  };

  const { data: menus } = useGetAll('menus', { company });

  const [showSidebar, setShowSidebar] = useState(false);

  const match = useMatch('/:dinein/:companyname/:route*');
  const navigate = useNavigate();

  return (
    <Fragment>
      <Navbar>
        <Navbar.Left>
          {match ? (
            <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
          ) : (
            <NavbarLogo
              logo={companyLogoSmall ? companyLogoSmall : companyLogoLarge}
            />
          )}
        </Navbar.Left>
        <Navbar.Right>
          {match && (
            <Button icon={<CartIcon />} onClick={() => navigate('cart')} />
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
          <Sidebar.Content justifyContent='center'>
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
    </Fragment>
  );
};

CustomerAppWrapper.propTypes = {
  company: PropTypes.string,
  companyDetails: PropTypes.object,
};

export default CustomerAppWrapper;
