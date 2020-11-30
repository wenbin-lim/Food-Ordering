import React, {
  useState,
  useEffect,
  useRef,
  Children,
  cloneElement,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

// Animations
import { TimelineMax } from 'gsap';

// Misc
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const ActionSheet = ({ className, onCloseActionSheet, children, ...rest }) => {
  const [actionSheetScrim] = useState(document.createElement('div'));
  actionSheetScrim.id = 'actionsheet-root';
  actionSheetScrim.classList.add('actionsheet-scrim');

  var scrimBgColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--scrim');

  const actionSheetRef = useRef(null);
  const animationTime = 0.3;

  const [tlm] = useState(
    new TimelineMax({
      paused: true,
      reversed: true,
      onReverseComplete: onCloseActionSheet,
    })
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.appendChild(actionSheetScrim);

    const actionSheet = actionSheetRef.current;

    if (actionSheetScrim && actionSheet) {
      actionSheet.addEventListener('mousedown', e => e.stopPropagation());

      tlm
        .to(
          actionSheetScrim,
          animationTime,
          {
            backdropFilter: 'blur(5px)',
            backgroundColor: scrimBgColor,
          },
          'animation'
        )
        .to(
          actionSheet,
          animationTime,
          {
            y: 0,
          },
          'animation'
        );

      tlm.play();
    }

    return () => {
      document.body.removeChild(actionSheetScrim);
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line
  }, []);

  const closeActionSheet = callback => {
    tlm
      .eventCallback('onReverseComplete', () => {
        onCloseActionSheet();
        if (typeof callback === 'function') {
          callback();
        }
      })
      .reverse();
  };

  actionSheetScrim.addEventListener('mousedown', mouseDownEvt => {
    const mouseDownElementId = mouseDownEvt.target.id;

    actionSheetScrim.addEventListener(
      'mouseup',
      mouseUpEvt => {
        const mouseUpElementId = mouseUpEvt.target.id;

        if (mouseDownElementId === mouseUpElementId) {
          closeActionSheet();
        }
      },
      { once: true }
    );
  });

  return createPortal(
    <div
      className={sanitizeWhiteSpace(
        `actionsheet ${className ? className : ''}`
      )}
      ref={actionSheetRef}
      {...rest}
    >
      {Children.map(
        children,
        child =>
          child?.type === Action &&
          cloneElement(child, {
            closeActionSheet,
          })
      )}
      <Action name='Close' closeActionSheet={closeActionSheet} />
    </div>,
    actionSheetScrim
  );
};
ActionSheet.propTypes = {
  className: PropTypes.string,
  onCloseActionSheet: PropTypes.func,
};

export const Action = ({
  className,
  name,
  onClick,
  closeActionSheet,
  children,
}) => {
  return (
    <button
      className={sanitizeWhiteSpace(`action ${className ? className : ''}`)}
      onClick={e => closeActionSheet(onClick)}
    >
      {name && <div className={'action-name'}>{name}</div>}
      {children}
    </button>
  );
};

Action.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  closeActionSheet: PropTypes.func,
};

export default ActionSheet;
