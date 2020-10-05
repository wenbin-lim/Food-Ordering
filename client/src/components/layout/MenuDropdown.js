import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Misc
import { v4 as uuid } from 'uuid';

/* 
  =====
  Props
  =====
  @name       items 
  @type       array of object {name, callback || link}
  @desc       create a list of buttons that have individual actions/callbacks from Parent
  @required   false
  @example

  const [actions] = useState([
    {
      name: 'action 1',
      callback: () => alert('action 1'),
      link: '/path',
    },
    {
      name: 'action 2',
      callback: () => alert('action 2'),
    },
    {
      name: 'action 3',
      callback: () => alert('action 3'),
    },
  ]);

  @name       closeDropdownMenuHandler
  @type       function
  @desc       function from Parent to unmount this component by changing the show state to false
  @required   true
*/
const MenuDropdown = ({ items, closeDropdownMenuHandler }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const menu = menuRef.current;
    const menuHeight = menu.getBoundingClientRect().height;
    const menuYPos = menu.getBoundingClientRect().bottom;

    const menuWidth = menu.getBoundingClientRect().width;
    const menuXPos = menu.getBoundingClientRect().left;
    console.log(menu.getBoundingClientRect());

    if (menuYPos + menuHeight > window.innerHeight) {
      menu.style.bottom = '100%';
      menu.style.top = 'auto';
      menu.style.transform = 'translateY(-8px)';
    } else {
      // original
      menu.style.top = '100%';
      menu.style.bottom = 'auto';
      menu.style.transform = 'translateY(8px)';
    }

    if (menuXPos + menuWidth > window.innerWidth) {
      menu.style.right = 0;
    }

    // remove the flickering when trying to change position
    menu.style.opacity = 1;

    // click outside to close dropdown menu
    const clickOutHandler = e => {
      if (menu && menu.contains(e.target)) {
        return;
      } else {
        closeDropdownMenuHandler();
      }
    };

    document.addEventListener('click', clickOutHandler, false);

    return () => {
      /* Functions to run before unmount */
      document.removeEventListener('click', clickOutHandler, false);
    };
    // eslint-disable-next-line
  }, []);

  let navigate = useNavigate();

  const onClickButton = item => {
    const { link, callback } = item;

    if (typeof callback === 'function') {
      callback();
    } else if (typeof link === 'string') {
      navigate(link);
    }

    closeDropdownMenuHandler();
  };

  return (
    <div className='menudropdown' ref={menuRef}>
      {items &&
        items.map(item => (
          <button
            className='menudropdown-item'
            key={uuid()}
            onClick={e => onClickButton(item)}
          >
            {item.name}
          </button>
        ))}
    </div>
  );
};

MenuDropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string,
      callback: PropTypes.func,
    })
  ),
  closeDropdownMenuHandler: PropTypes.func.isRequired,
};

export default MenuDropdown;
