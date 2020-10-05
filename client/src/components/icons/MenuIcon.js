import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// animations
import { TimelineMax } from 'gsap';

/* 
  =====
  Props
  =====
  1. width, height
  @type       number
  @desc       scale icon
  @required   false
  @default    24

  2. shouldAnimate
  @type       boolean
  @desc       enables Menu Icon to transform into a X icon
  @required   false
  @default    false

  3. toggleAnimation
  @type       boolean
  @desc       comes from Parent to toggle the animation to either menu or X
  @required   true if shouldAnimate is true

  4. animationTime
  @type       number
  @desc       defines the animation time
  @required   true if shouldAnimate is true
  @default    0.3
*/
const MenuIcon = ({
  width = 24,
  height = 24,
  shouldAnimate = false,
  toggleAnimation,
  animationTime = 0.3,
}) => {
  const line1 = useRef(null);
  const line2 = useRef(null);
  const line3 = useRef(null);

  const [tlm] = useState(new TimelineMax({ paused: true, reversed: true }));

  useEffect(() => {
    if (shouldAnimate) {
      const line2AnimationTime = animationTime / 2;
      const line1line3AnimationTime = animationTime / 2;

      tlm
        .to(
          line2.current,
          line2AnimationTime,
          { scaleX: 0, transformOrigin: '50%, 50%' },
          0
        )
        .to(
          line1.current,
          line1line3AnimationTime,
          {
            rotation: 45,
            transformOrigin: '50% 50%',
            y: 6,
          },
          'cross'
        )
        .to(
          line3.current,
          line1line3AnimationTime,
          {
            rotation: -45,
            transformOrigin: '50% 50%',
            y: -6,
          },
          'cross'
        );
    }
    // eslint-disable-next-line
  }, []);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      tlm.reversed() ? tlm.play() : tlm.reverse();
    }
    // eslint-disable-next-line
  }, [toggleAnimation]);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon menuIcon'
    >
      <line ref={line1} x1='3' y1='6' x2='21' y2='6'></line>
      <line ref={line2} x1='3' y1='12' x2='21' y2='12'></line>
      <line ref={line3} x1='3' y1='18' x2='21' y2='18'></line>
    </svg>
  );
};

MenuIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  shouldAnimate: PropTypes.bool,
  toggleAnimation: (props, propName) => {
    if (
      typeof props['shouldAnimate'] !== 'undefined' &&
      props['shouldAnimate'] &&
      typeof props[propName] !== 'boolean'
    ) {
      return new Error(
        'toggleAnimation is required if shouldAnimate is true. toggleAnimation should be a boolean'
      );
    }
  },
  animationTime: (props, propName) => {
    if (
      typeof props['shouldAnimate'] !== 'undefined' &&
      props['shouldAnimate'] &&
      typeof props[propName] !== 'number'
    ) {
      return new Error(
        'animationTime is required if shouldAnimate is true. animationTime should be a number'
      );
    }
  },
};

export default MenuIcon;
