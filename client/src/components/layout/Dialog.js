import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Animations
import { TimelineMax, Power4 } from 'gsap';

/* 
  =====
  Props
  =====
  @name       header 
  @type       jsx or string
  @desc       header of the dialog
  @required   false
  
  @name       content 
  @type       jsx or string
  @desc       content of the dialog
  @required   false

  @name       footer 
  @type       jsx or string
  @desc       footer of the dialog
  @required   false

  @name       fullscreen 
  @type       boolean
  @desc       determines if dialog is fullscreen
  @required   false
  @default    false

  @name       closeDialogHandler 
  @type       function
  @desc       function from parent to close this dialog when clicking on scrim
  @desc       give an empty function if u dont wan to close dialog when clicking on scrim
  @required   true
*/
const Dialog = ({
  header,
  content,
  footer,
  fullscreen = false,
  closeDialogHandler,
}) => {
  const scrimRef = useRef(null);
  const dialogRef = useRef(null);

  const [tlm] = useState(
    new TimelineMax({
      paused: true,
      reversed: true,
      onReverseComplete: closeDialogHandler,
    })
  );

  const [animationTime] = useState(0.3);

  useEffect(() => {
    if (fullscreen) {
      tlm
        .to(
          scrimRef.current,
          animationTime,
          {
            opacity: 1,
            ease: Power4.easeOut,
          },
          'dialogFullscreen'
        )
        .to(
          dialogRef.current,
          animationTime,
          {
            x: 0,
            ease: Power4.easeOut,
          },
          'dialogFullscreen'
        );
    } else {
      tlm
        .to(
          scrimRef.current,
          animationTime,
          {
            opacity: 1,
            ease: Power4.easeOut,
          },
          'dialog'
        )
        .to(
          dialogRef.current,
          animationTime,
          {
            scale: 1,
            ease: Power4.easeOut,
          },
          'dialog'
        );
    }

    tlm.play();

    document.body.style.overflow = 'hidden';

    return () => {
      /* Functions to run before unmount */
      document.body.style.overflow = 'auto';
    };
    // eslint-disable-next-line
  }, []);

  const closeDialog = () => {
    tlm.reverse();
  };

  return (
    <div className='dialog-scrim' ref={scrimRef} onClick={closeDialog}>
      <div
        className={`dialog ${fullscreen ? 'dialog-fullscreen' : ''}`}
        ref={dialogRef}
        onClick={e => e.stopPropagation()}
      >
        {header && <div className='dialog-header'>{header}</div>}
        {content && <div className='dialog-content'>{content}</div>}
        {footer && <div className='dialog-footer'>{footer}</div>}
      </div>
    </div>
  );
};

Dialog.propTypes = {
  header: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  footer: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  fullscreen: PropTypes.bool,
  closeDialogHandler: PropTypes.func.isRequired,
};

export default Dialog;
