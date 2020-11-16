import React, { useRef, Children, cloneElement, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Components
import Button from './Button';

// Icons
import MoreIcon from '../icons/MoreIcon';

// Animations
import { TweenMax } from 'gsap';

/* 
  actions={[
  {
    name: 'View',
    path: `${userId}`,
  },
  {
    name: 'Edit',
    path: `${userId}/edit`,
  },
  {
    name: 'Delete',
    callback: () => console.log('delete'),
  },
]}
*/
const ListItem = ({ className, children, color = 'surface1', ...rest }) => {
  const listItemChildren = Children.toArray(children);

  const actions = listItemChildren.find(({ type }) => type === Actions);

  const listItemRef = useRef(null);
  const actionsRef = useRef(null);

  const animationTime = 0.3;
  const gap = 8;

  const onDrag = useDrag(
    ({ down, movement: [movementX] }) => {
      const listItem = listItemRef.current;
      const actions = actionsRef.current;
      const minSwipeDist = 60;
      const opacityFactor = 0.5;

      if (listItem && actions) {
        const actionsWidth = actions.offsetWidth;

        if (down) {
          if (movementX < 0) {
            listItem.style.transform = `translateX(${movementX}px)`;
            actions.style.opacity =
              (Math.abs(movementX) / actionsWidth) * opacityFactor;
            // prevent list from scrolling when dragging
            document.body.style.overflow = 'hidden';
          }
        } else {
          if (movementX < 0) {
            if (Math.abs(movementX) < minSwipeDist) {
              toggleActions(false);
            } else {
              // open fully and show list actions
              toggleActions(true);
            }
            // allow list to scroll after drag action is done
            document.body.style.overflow = 'auto';
          }
        }
      }
    },
    {
      axis: 'x',
      enabled: actions,
    }
  );

  const toggleActions = open => {
    const listItem = listItemRef.current;
    const actions = actionsRef.current;

    if (listItem && actions) {
      const listItemStyle = window.getComputedStyle(listItem);
      const listItemMatrix = new DOMMatrixReadOnly(listItemStyle.transform);
      const listItemCurrX = listItemMatrix.m41;
      const listItemFullyOpenDistance = actions.offsetWidth + gap;

      const actionsCurrOpacity = actions.style.opacity;

      TweenMax.fromTo(
        listItem,
        animationTime,
        { x: listItemCurrX },
        { x: open ? -listItemFullyOpenDistance : 0 }
      );
      TweenMax.fromTo(
        actions,
        animationTime,
        { opacity: actionsCurrOpacity },
        {
          opacity: open ? 1 : 0,
          pointerEvents: 'auto',
        }
      ).eventCallback('onComplete', () => {
        ['touchstart', 'click'].forEach(eventType => {
          if (open) {
            document.addEventListener(
              eventType,
              handleClicksOutsideOfListItemAction
            );
          } else {
            document.removeEventListener(
              eventType,
              handleClicksOutsideOfListItemAction
            );
          }
        });
      });
    }
  };

  const handleClicksOutsideOfListItemAction = e =>
    !actionsRef.current?.contains(e.target) && toggleActions(false);

  return (
    <div className='list-item-wrapper' {...rest}>
      {actions &&
        cloneElement(actions, {
          ref: actionsRef,
        })}
      <div
        className={sanitizeWhiteSpace(
          `list-item list-item-${color} ${className ? className : ''}`
        )}
        ref={listItemRef}
        {...onDrag()}
      >
        {listItemChildren.find(({ type }) => type === Before)}
        {listItemChildren.find(({ type }) => type === Content)}
        {listItemChildren.find(({ type }) => type === After)}
        {listItemChildren.find(({ type }) => type === Actions) && (
          <Button icon={<MoreIcon />} onClick={() => toggleActions(true)} />
        )}
      </div>
    </div>
  );
};

ListItem.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'background',
    'surface1',
    'surface2',
    'surface3',
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
  ]),
};

const Before = ({ className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `before-list-content ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

Before.propTypes = {
  className: PropTypes.string,
};

const Content = ({ className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `list-content ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

Content.propTypes = {
  className: PropTypes.string,
};

const After = ({ className, children, ...rest }) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `after-list-content ${className ? className : ''}`
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

After.propTypes = {
  className: PropTypes.string,
};

const Actions = forwardRef(({ className, children, ...rest }, ref) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `list-item-actions ${className ? className : ''}`
      )}
      ref={ref}
      {...rest}
    >
      {Children.map(children, child => child?.type === Action && child)}
    </section>
  );
});

Actions.propTypes = {
  className: PropTypes.string,
};

export const Action = ({ name, className, color = 'surface1', ...rest }) => {
  return (
    <div
      className={sanitizeWhiteSpace(
        `list-item-action list-item-action-${color} ${
          className ? className : ''
        }`
      )}
      {...rest}
    >
      <span className='list-item-action-name'>{name}</span>
    </div>
  );
};

Action.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'background',
    'surface1',
    'surface2',
    'surface3',
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
  ]),
};

ListItem.Before = Before;
ListItem.Content = Content;
ListItem.After = After;
ListItem.Actions = Actions;

export default ListItem;
