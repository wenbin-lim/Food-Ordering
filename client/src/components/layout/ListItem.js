import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Misc
import { v4 as uuid } from 'uuid';

// Components
import Button from './Button';

// Icons
import MoreIcon from '../icons/MoreIcon';

// Animations
import { TweenMax, Power4 } from 'gsap';

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
const ListItem = ({
  classes,
  color = 'surface1',
  beforeListContent,
  listContentClass,
  listContent,
  afterListContent,
  onClick,
  actions,
}) => {
  const listItemRef = useRef(null);
  const listItemActionsRef = useRef(null);

  const animationTime = 0.3;
  const gap = 16;

  const onDrag = useDrag(
    ({ down, movement: [movementX] }) => {
      const list = listItemRef.current;
      const action = listItemActionsRef.current;
      const minSwipeDist = 60;
      const opacityFactor = 0.5;

      if (list && action) {
        const actionWidth = action.offsetWidth;

        if (down) {
          if (movementX < 0) {
            list.style.transform = `translateX(${movementX}px)`;
            action.style.opacity =
              (Math.abs(movementX) / actionWidth) * opacityFactor;

            // prevent list from scrolling when dragging
            document.body.style.overflow = 'hidden';
          }
        } else {
          if (movementX < 0) {
            if (Math.abs(movementX) < minSwipeDist) {
              TweenMax.fromTo(list, 0.1, { x: movementX }, { x: 0 });
            } else {
              // open fully and show list actions
              openListItemActions(
                movementX,
                (Math.abs(movementX) / actionWidth) * opacityFactor
              );
            }
            // allow list to scroll after drag action is done
            document.body.style.overflow = 'auto';
          }
        }
      }
    },
    {
      axis: 'x',
      enabled: actions && actions.length > 0,
    }
  );

  const openListItemActions = (listCurrXPos = 0, actionCurrOpacity = 0) => {
    const list = listItemRef.current;
    const action = listItemActionsRef.current;

    if (list && action) {
      const actionWidth = action.offsetWidth;

      TweenMax.fromTo(
        list,
        animationTime,
        {
          x: listCurrXPos,
        },
        {
          x: -(actionWidth + gap),
          ease: Power4.easeOut,
        }
      );
      TweenMax.fromTo(
        action,
        animationTime,
        {
          opacity: actionCurrOpacity,
        },
        {
          opacity: 1,
          ease: Power4.easeOut,
          pointerEvents: 'auto',
        }
      ).eventCallback('onComplete', () =>
        ['touchstart', 'click'].map(eventType =>
          document.addEventListener(
            eventType,
            handleClicksOutsideOfListItemAction
          )
        )
      );
    }
  };

  const navigate = useNavigate();

  const closeListItemActions = action => {
    const listItem = listItemRef.current;
    const listItemAction = listItemActionsRef.current;

    if (listItem && listItemAction) {
      TweenMax.to(listItemAction, animationTime, {
        opacity: 0,
        ease: Power4.easeOut,
        pointerEvents: 'none',
      });
      TweenMax.to(listItem, animationTime, {
        x: 0,
        ease: Power4.easeOut,
      }).eventCallback('onComplete', () => {
        // remove the handleClicksOutsideOfListItemAction
        ['touchstart', 'click'].map(eventType =>
          document.removeEventListener(
            eventType,
            handleClicksOutsideOfListItemAction
          )
        );

        const { path, callback } = { ...action };

        if (typeof callback === 'function') {
          callback();
        } else if (typeof path === 'string') {
          navigate(path);
        }
      });
    }
  };

  const handleClicksOutsideOfListItemAction = e => {
    const listItemAction = listItemActionsRef.current;

    if (listItemAction && !listItemAction.contains(e.target)) {
      // close list item actions when clicked outside of it
      closeListItemActions();
    }
  };

  useEffect(() => {
    const list = listItemRef.current;

    if (list && onClick) {
      list.style.cursor = 'pointer';
    }
  }, [onClick]);

  return (
    <div
      className={sanitizeWhiteSpace(
        `list-item-wrapper ${classes ? classes : ''}`
      )}
    >
      {Array.isArray(actions) && actions.length > 0 && (
        <div className='list-item-actions' ref={listItemActionsRef}>
          {actions.map(action => (
            <div
              className={sanitizeWhiteSpace(
                `list-item-action list-item-${color}`
              )}
              key={uuid()}
              onClick={() => closeListItemActions(action)}
            >
              <span className='list-item-action-name'>{action.name}</span>
            </div>
          ))}
        </div>
      )}
      <div
        className={sanitizeWhiteSpace(`list-item list-item-${color}`)}
        ref={listItemRef}
        {...onDrag()}
        onClick={onClick}
      >
        {beforeListContent && (
          <div className='before-list-content'>{beforeListContent}</div>
        )}

        {listContent && (
          <div
            className={sanitizeWhiteSpace(
              `list-content ${listContentClass ? listContentClass : ''}`
            )}
          >
            {listContent}
          </div>
        )}

        {afterListContent && (
          <div className='after-list-content'>{afterListContent}</div>
        )}

        {Array.isArray(actions) && actions.length > 0 && (
          <Button icon={<MoreIcon />} onClick={openListItemActions} />
        )}
      </div>
    </div>
  );
};

ListItem.propTypes = {
  classes: PropTypes.string,
  color: PropTypes.oneOf([
    'surface1',
    'surface2',
    'surface3',
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
    'background',
  ]),
  beforeListContent: PropTypes.element,
  listContentClass: PropTypes.string,
  listContent: PropTypes.element,
  afterListContent: PropTypes.element,
  onClick: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      callback: PropTypes.func,
    }).isRequired
  ),
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);
