import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  createElement,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Animations
import { TimelineMax } from 'gsap';

// Misc
import { v4 as uuid } from 'uuid';

const Dialog = forwardRef(
  (
    {
      scrimElementType = 'div',
      dialogElementType = 'article',
      className,
      fullscreen = false,
      onCloseDialog,
      children,
      ...rest
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      tlm,
      closeDialog,
    }));

    const dialogRef = useRef(null);
    const animationTime = 0.3;

    const [dialogScrim] = useState(document.createElement(scrimElementType));
    const dialogScrimId = uuid();
    dialogScrim.id = dialogScrimId;
    dialogScrim.classList.add('dialog-scrim');

    var scrimBgColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--scrim');

    const [tlm] = useState(
      new TimelineMax({
        paused: true,
        reversed: true,
        onReverseComplete: onCloseDialog,
      })
    );

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      document.body.appendChild(dialogScrim);

      const dialog = dialogRef.current;

      if (dialogScrim && dialog) {
        const dialogAnimation = fullscreen ? { x: 0 } : { scale: 1 };

        tlm
          .to(
            dialogScrim,
            animationTime,
            {
              backdropFilter: 'blur(5px)',
              backgroundColor: scrimBgColor,
            },
            'dialogAnimation'
          )
          .to(
            dialog,
            animationTime,
            {
              ...dialogAnimation,
              opacity: 1,
            },
            'dialogAnimation'
          );
      }

      tlm.play();

      return () => {
        document.body.removeChild(dialogScrim);
        document.body.style.overflow = 'auto';
      };

      // eslint-disable-next-line
    }, []);

    const closeDialog = () => tlm.reverse();

    // dialogScrim.onclick = closeDialog;
    dialogScrim.addEventListener('mousedown', mouseDownEvt => {
      const mouseDownElementId = mouseDownEvt.target.id;

      dialogScrim.addEventListener(
        'mouseup',
        mouseUpEvt => {
          const mouseUpElementId = mouseUpEvt.target.id;

          if (mouseDownElementId === mouseUpElementId) {
            if (mouseUpElementId === dialogScrimId) {
              closeDialog();
            }
          }
        },
        { once: true }
      );
    });

    return createPortal(
      createElement(
        dialogElementType,
        {
          className: sanitizeWhiteSpace(
            `dialog
          ${fullscreen ? 'dialog-fullscreen' : ''} 
          ${className ? className : ''}
          `
          ),
          ref: dialogRef,
          ...rest,
        },
        children
      ),
      dialogScrim
    );
  }
);

Dialog.propTypes = {
  scrimElementType: PropTypes.string,
  dialogElementType: PropTypes.string,
  className: PropTypes.string,
  fullscreen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

export default Dialog;
