import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Animations
import { TimelineMax, Power4 } from 'gsap';

const Dialog = forwardRef(
  (
    { content, classes, style, fullscreen = false, unmountDialogHandler },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      tlm,
      closeDialog,
    }));

    const scrimRef = useRef(null);
    const dialogRef = useRef(null);
    const animationTime = 0.3;

    const dialogRootContainer = document.getElementById('dialog-root');

    var scrimBgColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--scrim');

    const [tlm] = useState(
      new TimelineMax({
        paused: true,
        reversed: true,
        onReverseComplete: unmountDialogHandler,
      })
    );

    useEffect(() => {
      document.body.style.overflow = 'hidden';

      const scrim = scrimRef.current;
      const dialog = dialogRef.current;

      if (scrim && dialog) {
        const dialogAnimation = fullscreen ? { x: 0 } : { scale: 1 };

        tlm
          .to(
            scrim,
            animationTime,
            {
              backdropFilter: 'blur(5px)',
              backgroundColor: scrimBgColor,
              ease: Power4.easeOut,
            },
            'dialogAnimation'
          )
          .to(
            dialog,
            animationTime,
            {
              ...dialogAnimation,
              ease: Power4.easeOut,
            },
            'dialogAnimation'
          );
      }

      tlm.play();

      return () => (document.body.style.overflow = 'auto');
      // eslint-disable-next-line
    }, []);

    const closeDialog = () => tlm.reverse();

    return createPortal(
      <div className='dialog-scrim' ref={scrimRef} onClick={closeDialog}>
        <article
          className={sanitizeWhiteSpace(
            `dialog
            ${fullscreen ? 'dialog-fullscreen' : ''}
            ${classes ? classes : ''}
            `
          )}
          ref={dialogRef}
          style={style}
          onClick={e => e.stopPropagation()}
        >
          {content}
        </article>
      </div>,
      dialogRootContainer
    );
  }
);

Dialog.propTypes = {
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  classes: PropTypes.string,
  style: PropTypes.object,
  fullscreen: PropTypes.bool,
  unmountDialogHandler: PropTypes.func.isRequired,
};

export default Dialog;
