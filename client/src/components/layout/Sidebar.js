import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';
// Router
import { NavLink } from 'react-router-dom';

// Component
import SocialMediaButtons from './SocialMediaButtons';

// Assets
import logo from '../../assets/logo.png';

// Animations
import { TweenMax, Power4 } from 'gsap';

/* 
  =====
  Props
  =====
  @name       unmountSidebar 
  @type       function
  @desc       from parent to unmount this sidebar
  @required   true

  ============
  Boilerplates
  ============
  <Link
    to='/login'
    className='sidebar-link'
    onClick={closeSidebar}
  >
    Login
  </Link>
*/
const Sidebar = ({ unmountSidebar }) => {
  const [animationTime] = useState(0.3);

  const scrimRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Begin animations
    // check if scrimRef and sidebarRef is mounted properly
    const scrim = scrimRef.current;
    const sidebar = sidebarRef.current;

    if (scrim && sidebar) {
      // sidebar scrim will fade in
      TweenMax.to(scrim, animationTime, {
        backgroundColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue('--scrim'),
      });
      // sidebar will slide in from left
      TweenMax.to(sidebar, animationTime, {
        x: 0,
        ease: Power4.easeOut,
      });
    }

    // prevent scrolling in outside of scrim
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };

    // eslint-disable-next-line
  }, []);

  const closeSidebar = () => {
    const scrim = scrimRef.current;
    const sidebar = sidebarRef.current;

    if (scrim && sidebar) {
      TweenMax.to(scrim, animationTime, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      });
      TweenMax.to(sidebar, animationTime, {
        xPercent: -100,
        ease: Power4.easeOut,
        onComplete: unmountSidebar,
      });
    }
  };

  const onDrag = useDrag(
    ({ down, movement: [movementX] }) => {
      const scrim = scrimRef.current;
      const sidebar = sidebarRef.current;
      const minSwipeDist = 60;

      if (sidebar && scrim) {
        if (down) {
          // move sidebar according to distance
          if (movementX < 0) {
            sidebar.style.transform = `translateX(${movementX}px)`;
          }
        } else {
          // revert back to original
          if (movementX < 0) {
            if (Math.abs(movementX) < minSwipeDist) {
              TweenMax.fromTo(
                sidebar,
                0.1,
                { x: movementX },
                {
                  x: 0,
                  ease: Power4.easeOut,
                }
              );
            } else {
              TweenMax.to(scrim, animationTime, {
                backgroundColor: 'rgba(0, 0, 0, 0)',
              });
              TweenMax.fromTo(
                sidebar,
                animationTime,
                { x: -minSwipeDist },
                {
                  xPercent: -100,
                  ease: Power4.easeOut,
                  onComplete: unmountSidebar,
                }
              );
            }
          }
        }
      }
    },
    {
      axis: 'x',
    }
  );

  return (
    <div
      className='sidebar-scrim'
      ref={scrimRef}
      onClick={e => closeSidebar(e)}
    >
      <aside
        className='sidebar'
        ref={sidebarRef}
        onClick={e => e.stopPropagation()}
        {...onDrag()}
      >
        <section className='sidebar-header'>
          <img className='logo invert-in-dark-mode' src={logo} alt='Logo' />
        </section>
        <section className='sidebar-content'>
          <NavLink
            to='/login'
            className='sidebar-link'
            activeClassName='active'
            onClick={closeSidebar}
          >
            Login
          </NavLink>
          <NavLink
            to='/register'
            className='sidebar-link'
            activeClassName='active'
            onClick={closeSidebar}
          >
            Register
          </NavLink>
        </section>
        <section className='sidebar-footer'>
          <SocialMediaButtons />
          <p className='body-1'>Powered by</p>
          <p className='body-2'>The W Company</p>
        </section>
      </aside>
    </div>
  );
};

Sidebar.propTypes = {
  unmountSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
