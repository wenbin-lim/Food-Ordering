import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Animations
import { Power4, TimelineMax } from 'gsap';

// Misc
import { v4 as uuid } from 'uuid';

/* 
  =====
  Props
  =====
  @name       actions 
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

  @name       closeActionSheetHandler
  @type       function
  @desc       function from Parent to unmount this component by changing the show state to false
  @required   true
*/

const ActionSheet = ({ actions, closeActionSheetHandler }) => {
  const scrimRef = useRef(null);
  const actionSheetRef = useRef(null);

  const [tlm] = useState(
    new TimelineMax({
      paused: true,
      reversed: true,
      onReverseComplete: closeActionSheetHandler,
    })
  );
  const animationTime = 0.3;

  useEffect(() => {
    tlm
      .to(
        scrimRef.current,
        animationTime,
        {
          opacity: 1,
          ease: Power4.easeInOut,
        },
        'animation'
      )
      .to(
        actionSheetRef.current,
        animationTime,
        {
          y: 0,
          ease: Power4.easeInOut,
        },
        'animation'
      );

    // Animate ActionSheet into view
    tlm.play();

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line
  }, []);

  const closeActionSheet = () => {
    tlm.reverse();
  };

  let navigate = useNavigate();

  const onClickButton = action => {
    const { link, callback } = action;

    tlm
      .eventCallback('onReverseComplete', () => {
        closeActionSheetHandler();
        if (typeof callback === 'function') {
          callback();
        } else if (typeof link === 'string') {
          navigate(link);
        }
        tlm.eventCallback('onReverseComplete', null);
      })
      .reverse();
  };

  return (
    <div
      className='actionsheet-scrim'
      onClick={closeActionSheet}
      ref={scrimRef}
    >
      <div
        className='actionsheet'
        onClick={e => e.stopPropagation()}
        ref={actionSheetRef}
      >
        {actions &&
          actions.map(action => (
            <button
              className='action'
              key={uuid()}
              onClick={e => onClickButton(action)}
            >
              {action.name}
            </button>
          ))}
        <button className='action' onClick={closeActionSheet}>
          Cancel
        </button>
      </div>
    </div>
  );
};

ActionSheet.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string,
      callback: PropTypes.func,
    })
  ),
  closeActionSheetHandler: PropTypes.func.isRequired,
};

export default ActionSheet;
