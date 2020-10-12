import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

// Animations
import { TweenMax } from 'gsap';
/* 
  =====
  Props
  =====
  @name       style 
  @type       string of ['contained', 'outline']
  @desc       button style
  @required   false

  @name       type 
  @type       string of ['background', 'primary', 'secondary', 'error', 'success', 'warning']
  @desc       type/color of button
  @required   false
  @default    'primary'

  @name       backgroundColor 
  @type       css background color
  @desc       sets background color of the button, will take precedence over type prop
  @required   false

  @name       color 
  @type       css color
  @desc       sets color of the button, will take precedence over type prop
  @required   false

  @name       small 
  @type       boolean
  @desc       makes the button smaller if true
  @required   false
  @default    false

  @name       block 
  @type       boolean
  @desc       makes the button take 100% of parent width
  @required   false
  @default    false

  @name       fixBlockBtnBottom 
  @type       boolean
  @desc       used in conjunction with btn-block 
  @desc       to fix the block btn at the bottom of the parent 
  @required   false
  @default    false

  @name       text 
  @type       string
  @desc       button text
  @required   false

  @name       icon 
  @type       jsx
  @desc       icon used for this button
  @required   false

  @name       leadingIcon 
  @type       boolean
  @desc       determines if appended icon is a leading icon
  @required   false
  @default    false

  @name       additionalText 
  @type       jsx or string
  @desc       additional text that is used in conjunction with btn-block
  @required   false

  @name       showAlert 
  @type       boolean
  @desc       determines if btn-alert is shown
  @required   false

  @name       ripple 
  @type       boolean
  @desc       determines if ripple effect is on
  @required   false
  @default    true

  @name       additionalClasses
  @type       string
  @desc       add more classes to this button
  @required   false

  @name       additionalStyles
  @type       css style object
  @desc       add more styles to this button
  @required   false

  @name       onClick 
  @type       function
  @desc       onclick function of this button
  @required   false

  @name       submit 
  @type       boolean
  @desc       button is type submit
  @required   false
  @default    false

  @name       form 
  @type       string
  @desc       id of form to submit
  @required   false
*/
const Button = ({
  btnStyle,
  type,
  backgroundColor,
  color,
  disabled = false,
  small = false,
  block = false,
  fixBlockBtnBottom,
  text,
  icon,
  leadingIcon = false,
  additionalText,
  showAlert,
  ripple = true,
  additionalClasses,
  additionalStyles,
  onClick,
  submit = false,
  form,
}) => {
  const styleClassName = btnStyle ? `btn-${btnStyle}` : '';
  const typeClassName = type ? `btn-${type}` : '';
  const smallClassName = small ? 'btn-small' : '';
  const blockClassName = block
    ? fixBlockBtnBottom
      ? 'btn-block btn-block-bottom'
      : 'btn-block'
    : '';
  const disabledClassName = disabled ? 'btn-disabled' : '';

  const [content, setContent] = useState(null);
  const [iconOnly, setIconOnly] = useState(false);

  useEffect(() => {
    if (text && icon) {
      setContent(
        <div className={`btn-content append-icon`}>
          {leadingIcon ? (
            <Fragment>
              {icon}
              {text}
            </Fragment>
          ) : (
            <Fragment>
              {text}
              {icon}
            </Fragment>
          )}
        </div>
      );
    } else {
      if (text) {
        setContent(text);
      } else if (icon) {
        setContent(icon);
        setIconOnly(true);
      }
    }
  }, [text, icon, leadingIcon]);

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

      if (iconOnly) {
        TweenMax.to(ripple, 0.3, {
          opacity: 1,
          scale: 1,
          clearProps: 'all',
        });
      } else {
        TweenMax.fromTo(
          ripple,
          0.5,
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
    }
  };

  const onClickHandler = e => {
    rippleEffect(e);

    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <button
      className={`btn ${styleClassName} ${typeClassName} ${smallClassName} ${blockClassName} ${disabledClassName} ${
        iconOnly ? 'btn-icon' : ''
      } ${additionalClasses ? additionalClasses : ''}`
        .replace(/\s+/g, ' ')
        .trim()}
      disabled={disabled}
      onClick={onClickHandler}
      type={submit ? 'submit' : 'button'}
      form={form ? form : null}
      style={{
        ...additionalStyles,
        backgroundColor: backgroundColor ? backgroundColor : null,
        color: color ? color : null,
        overflow: iconOnly ? null : 'hidden',
        justifyContent: additionalText ? 'space-between' : null,
      }}
      ref={buttonRef}
    >
      {ripple && !iconOnly && (
        <div className='btn-ripple-effect' ref={rippleRef} />
      )}
      {content}
      {additionalText && <div className='btn-content'>{additionalText}</div>}
      {iconOnly && showAlert && <div className='btn-alert'></div>}
    </button>
  );
};

Button.propTypes = {
  btnStyle: PropTypes.string,
  type: PropTypes.oneOf([
    'background',
    'primary',
    'secondary',
    'error',
    'success',
    'warning',
  ]),
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  small: PropTypes.bool,
  block: PropTypes.bool,
  fixBlockBtnBottom: PropTypes.bool,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  icon: PropTypes.element,
  leadingIcon: PropTypes.bool,
  additionalText: PropTypes.element,
  showAlert: PropTypes.bool,
  ripple: PropTypes.bool,
  additionalClasses: PropTypes.string,
  additionalStyles: PropTypes.object,
  onClick: PropTypes.func,
  submit: PropTypes.bool,
  form: PropTypes.string,
};

export default Button;
