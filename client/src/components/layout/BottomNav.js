import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Components
import MenuDropdown from '../layout/MenuDropdown';

// Icons
import MoreIcon from '../icons/MoreIcon';

// Misc
import { v4 as uuid } from 'uuid';

/* 
  =====
  Props
  =====
  @name       maxItemShown 
  @type       number
  @desc       max number of nav items to be shown in full viewport width
  @required   false
  @default    5

  @name       navItems 
  @type       array of objects {icon, desc, link}
  @desc       to create the nav items
  @required   true
*/
export const BottomNav = ({ maxItemShown = 5, navItems }) => {
  const [showAdditionalNavItems, setShowAdditionalNavItems] = useState(false);

  useEffect(() => {
    /* Functions to run on mount */
    document.documentElement.style.setProperty(
      '--container-bottom-padding',
      `0`
    );

    return () => {
      /* Functions to run before unmount */
      document.documentElement.style.setProperty(
        '--container-bottom-padding',
        `env(safe-area-inset-bottom)`
      );
    };
    // eslint-disable-next-line
  }, []);

  const toggleAdditionalNavItems = () => {
    setShowAdditionalNavItems(!showAdditionalNavItems);
  };

  return (
    <nav className='bottom-nav'>
      <section className='bottom-nav-items'>
        {navItems && navItems.length <= maxItemShown ? (
          navItems.map(item => (
            <div className='nav-item' key={uuid()}>
              {item.icon && (
                <Link className='btn-icon' to={item.path}>
                  {item.icon}
                </Link>
              )}
              {item.desc && <span className='nav-item-desc'>{item.desc}</span>}
            </div>
          ))
        ) : (
          <Fragment>
            {navItems.map((item, index) => {
              if (index < maxItemShown - 1) {
                return (
                  <div className='nav-item' key={uuid()}>
                    {item.icon && (
                      <Link className='btn-icon' to={item.path}>
                        {item.icon}
                      </Link>
                    )}
                    {item.desc && (
                      <span className='nav-item-desc'>{item.desc}</span>
                    )}
                  </div>
                );
              } else {
                return null;
              }
            })}
            <div className='nav-item' onClick={toggleAdditionalNavItems}>
              <MoreIcon type='horizontal' />
              {showAdditionalNavItems && (
                <MenuDropdown
                  items={navItems.slice(maxItemShown).map(item => {
                    return {
                      name: item.desc,
                      link: item.path,
                    };
                  })}
                  closeDropdownMenuHandler={toggleAdditionalNavItems}
                />
              )}
            </div>
          </Fragment>
        )}
      </section>
    </nav>
  );
};

BottomNav.propTypes = {
  maxItemShown: PropTypes.number,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element,
      desc: PropTypes.string,
      path: PropTypes.string.isRequired,
    })
  ),
};

export default BottomNav;
