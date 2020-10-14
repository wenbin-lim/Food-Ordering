// eslint-disable-next-line
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';

// Misc
import { v4 as uuid } from 'uuid';

// Components
import Button from './Button';

// Icons
import MoreIcon from '../icons/MoreIcon';

// Animations
import { TweenMax, Power4 } from 'gsap';

/* 
  =====
  Props
  =====
  @name       beforeListContent
  @type       jsx
  @desc       jsx element that appears before the list content
  
  @name       listContent
  @type       jsx
  @desc       jsx element for list content

  @name       afterListContent
  @type       jsx
  @desc       jsx element that appears after the list content

  @name       onClickListItem
  @type       function
  @desc       function callback after clicking on list
  @required   false

  @name       actions
  @type       array of actions
  @desc       actions when user swipe on list item or press the more icon
  @example
    actions={[
    {
      name: 'View',
      link: `${userId}`,
    },
    {
      name: 'Edit',
      link: `${userId}/edit`,
    },
    {
      name: 'Delete',
      callback: () => console.log('delete'),
    },
  ]}

  @name       screenOrientation
  @type       boolean
  @desc       different list-item-action size for portrait and lanscape
  @required   true
*/
const ListItem = ({
  beforeListContent,
  listContent,
  afterListContent,
  onClickListItem,
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
              // snap back to original
              TweenMax.fromTo(
                list,
                0.1,
                { x: movementX },
                {
                  x: 0,
                  ease: Power4.easeOut,
                }
              );
            } else {
              // open fully and show list actions
              TweenMax.fromTo(
                list,
                animationTime,
                { x: movementX },
                {
                  x: -(actionWidth + gap),
                  ease: Power4.easeOut,
                }
              );
              TweenMax.fromTo(
                action,
                animationTime,
                {
                  opacity: (Math.abs(movementX) / actionWidth) * opacityFactor,
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

  const openListItemActions = () => {
    const list = listItemRef.current;
    const action = listItemActionsRef.current;

    if (list && action) {
      const actionWidth = action.offsetWidth;

      TweenMax.to(list, animationTime, {
        x: -(actionWidth + gap),
        ease: Power4.easeOut,
      });
      TweenMax.to(action, animationTime, {
        opacity: 1,
        ease: Power4.easeOut,
        pointerEvents: 'auto',
      }).eventCallback('onComplete', () =>
        ['touchstart', 'click'].map(eventType =>
          document.addEventListener(
            eventType,
            handleClicksOutsideOfListItemAction
          )
        )
      );
    }
  };

  const closeListItemActions = actionCallback => {
    const list = listItemRef.current;
    const action = listItemActionsRef.current;

    if (list && action) {
      TweenMax.to(action, animationTime, {
        opacity: 0,
        ease: Power4.easeOut,
        pointerEvents: 'none',
      });
      TweenMax.to(list, animationTime, {
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

        // call actionCallback if any
        if (typeof actionCallback === 'function') {
          actionCallback();
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

  const navigate = useNavigate();

  const handleListAction = action => {
    const { link, callback } = action;

    if (typeof link === 'string') {
      navigate(link);
      closeListItemActions();
    }

    if (typeof callback === 'function') {
      closeListItemActions(callback);
    }
  };

  useEffect(() => {
    const list = listItemRef.current;

    if (list && onClickListItem) {
      list.style.cursor = 'pointer';
    }
  }, [onClickListItem]);

  return (
    <div className='list-item-wrapper'>
      {actions && actions.length > 0 && (
        <div className='list-item-actions' ref={listItemActionsRef}>
          {actions.map(action => (
            <div
              className='list-item-action'
              key={uuid()}
              onClick={() => handleListAction(action)}
            >
              <span className='list-item-action-name'>{action.name}</span>
            </div>
          ))}
        </div>
      )}
      <div
        className='list-item'
        ref={listItemRef}
        {...onDrag()}
        onClick={onClickListItem}
      >
        {beforeListContent && (
          <div className='before-list-content'>{beforeListContent}</div>
        )}
        {listContent && <div className='list-content'>{listContent}</div>}
        {afterListContent && (
          <div className='after-list-content'>{afterListContent}</div>
        )}
        {actions && actions.length > 0 && (
          <Button icon={<MoreIcon />} onClick={openListItemActions} />
        )}
      </div>
    </div>
  );
};

ListItem.propTypes = {
  beforeListContent: PropTypes.element,
  listContent: PropTypes.element,
  afterListContent: PropTypes.element,
  onClickListItem: PropTypes.func,
  actions: PropTypes.array,
  screenOrientation: PropTypes.bool,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);
