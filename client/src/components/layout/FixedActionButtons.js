import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

// Components
import Button from './Button';

// Icons
import MenuIcon from '../icons/MenuIcon';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const FixedActionButtons = ({
  fixBottom = true,
  fixRight = true,
  fixedToParentElement = true,
  toggleMenu = false,
  toggleMenuIcon = <MenuIcon />,
  horizontal = true,
  children,
}) => {
  const [showRest, setShowRest] = useState(false);

  return (
    <section
      className={sanitizeWhiteSpace(
        `fixed-action-buttons 
      ${fixedToParentElement ? 'fixed-to-parent' : ''}
      ${fixBottom ? 'fixed-to-bottom' : 'fixed-to-top'}
      ${fixRight ? 'fixed-to-right' : 'fixed-to-left'}
      ${horizontal ? 'buttons-horizontal' : 'buttons-vertical'}
      `
      )}
    >
      {toggleMenu && (
        <Button
          className='fixed-action-button'
          fill='contained'
          type='primary'
          icon={toggleMenuIcon}
          onClick={() => setShowRest(!showRest)}
        />
      )}
      {Children.map(children, child =>
        cloneElement(child, {
          className: sanitizeWhiteSpace(
            `fixed-action-button
              ${toggleMenu && (showRest ? 'show-fab' : 'hide-fab')}
            `
          ),
        })
      )}
    </section>
  );
};

FixedActionButtons.propTypes = {
  fixBottom: PropTypes.bool,
  fixRight: PropTypes.bool,
  fixedToParentElement: PropTypes.bool,
  toggleMenu: PropTypes.bool,
  toggleMenuIcon: PropTypes.element,
  horizontal: PropTypes.bool,
};

export default FixedActionButtons;
