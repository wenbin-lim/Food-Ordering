import React, { useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Animations
import { TweenMax } from 'gsap';

const Button = ({
  fill,
  type,
  small = false,
  block = false,
  blockBtnBottom = false,
  submit = false,
  form,
  disabled = false,
  text,
  icon,
  leadingIcon = false,
  additionalContentClasses,
  additionalContent,
  ripple = true,
  classes,
  style,
  onClick,
}) => {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  const rippleEffect = e => {
    // move ripple effect to mouse position
    const button = buttonRef.current;
    const ripple = rippleRef.current;

    if (ripple && button) {
      const buttonLeft = button.getBoundingClientRect().left;
      const buttonTop = button.getBoundingClientRect().top;

      const buttonHeight = button.offsetHeight;
      const buttonWidth = button.offsetWidth;
      const rippleHeight = ripple.offsetHeight;
      const rippleWidth = ripple.offsetWidth;

      const scaleFactor = Math.max(
        buttonHeight / rippleHeight,
        buttonWidth / rippleWidth
      );

      TweenMax.fromTo(
        ripple,
        0.3,
        {
          x: `${e.clientX - buttonLeft}px`,
          y: `${e.clientY - buttonTop}px`,
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: scaleFactor,
          clearProps: 'all',
        }
      );
    }
  };

  const onClickHandler = e => {
    ripple && rippleEffect(e);

    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <button
      className={sanitizeWhiteSpace(
        `btn
          ${fill ? `btn-${fill}` : ''}
          ${type ? `btn-${type}` : ''}
          ${small ? 'btn-small' : ''}
          ${
            block ? `btn-block ${blockBtnBottom ? 'btn-block-bottom' : ''}` : ''
          }
          ${disabled ? 'btn-disabled' : ''}
          ${icon && !text ? 'btn-icon' : ''}
          ${classes ? classes : ''}
          `
      )}
      disabled={disabled}
      onClick={onClickHandler}
      type={submit ? 'submit' : 'button'}
      form={form ? form : null}
      style={style}
      ref={buttonRef}
    >
      {icon && text ? (
        <div className={'btn-content'}>
          {leadingIcon && icon}
          {text}
          {!leadingIcon && icon}
        </div>
      ) : (
        <Fragment>
          {icon}
          {text}
        </Fragment>
      )}

      {block && additionalContent && (
        <div
          className={sanitizeWhiteSpace(
            `btn-additional-content 
            ${additionalContentClasses ? additionalContentClasses : ''}
            `
          )}
        >
          {additionalContent}
        </div>
      )}

      {ripple && (text || additionalContent) && (
        <div className='btn-ripple-effect' ref={rippleRef} />
      )}
    </button>
  );
};

Button.propTypes = {
  fill: PropTypes.oneOf(['contained', 'outline']),
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
    'background',
  ]),
  small: PropTypes.bool,
  block: PropTypes.bool,
  blockBtnBottom: PropTypes.bool,
  submit: PropTypes.bool,
  form: PropTypes.string,
  disabled: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  icon: PropTypes.element,
  leadingIcon: PropTypes.bool,
  additionalContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  ripple: PropTypes.bool,
  classes: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Button;
