import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useMatch } from 'react-router-dom';

// Components
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/layout/Button';
import CartDialog from './CartDialog';

// Icons
import MenuIcon from '../../components/icons/MenuIcon';
import CartIcon from '../../components/icons/CartIcon';

// Actions
import { getMenus } from '../../actions/menus';

const CustomerAppWrapper = ({
  customerCompany,
  customerCompanyId,
  customerCompanyName,
  menus: { menusLoading, menus },
  getMenus,
}) => {
  const {
    socialMediaLinks,
    logo: { small: logoSmall, large: logoLarge } = {},
  } = customerCompany;

  let match = useMatch({
    path: `/dinein/${customerCompanyName}/:route`,
    end: false,
  });

  const navbarLeftContent = match ? (
    <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
  ) : (
    (logoSmall || logoLarge) && (
      <img
        className='navbar-logo invert-in-dark-mode'
        src={logoSmall ? logoSmall : logoLarge}
        alt='logo'
      />
    )
  );

  const [showCartDialog, setShowCartDialog] = useState(false);
  const navbarRightContent = match && (
    <Button icon={<CartIcon />} onClick={() => setShowCartDialog(true)} />
  );

  useEffect(() => {
    getMenus(customerCompanyId);

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
        rightContent={navbarRightContent}
      />
      {match && showSidebar && (
        <Sidebar
          ref={sidebarRef}
          headerContent={sidebarHeader}
          sidebarLinks={sidebarLinks}
          socialMediaLinks={socialMediaLinks}
          unmountSidebarHandler={() => setShowSidebar(false)}
        />
      )}
      <Outlet />
      {showCartDialog && (
        <CartDialog unmountCartDialog={() => setShowCartDialog(false)} />
      )}
    </Fragment>
  );
};

CustomerAppWrapper.propTypes = {
  customerCompany: PropTypes.object.isRequired,
  customerCompanyId: PropTypes.string.isRequired,
  customerCompanyName: PropTypes.string.isRequired,
  menus: PropTypes.object.isRequired,
  getMenus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  menus: state.menus,
});

const mapDispatchToProps = {
  getMenus,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerAppWrapper);
