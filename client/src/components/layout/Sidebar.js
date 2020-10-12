import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';
// Router
import { useNavigate, useLocation } from 'react-router-dom';

// Component
import SocialMediaButtons from './SocialMediaButtons';

// Animations
import { TweenMax, Power4 } from 'gsap';

// Misc
import { v4 as uuid } from 'uuid';

/* 
  =====
  Props
  =====
  @name       headerContent
  @type       jsx element
  @desc       sidebar header content
  @required   false

  @name       sidebarLinks
  @type       array of object of {name, link}
  @desc       sidebar links to redirect to
  @required   false

  @name       socialMediaLinks
  @type       object of {facebook, twitter, instagram: url string}
  @desc       facebook twitter instagram redirect links
  @required   false

  @name       unmountSidebar 
  @type       function
  @desc       from parent to unmount this sidebar
  @required   true

*/
const Sidebar = ({
  headerContent,
  sidebarLinks,
  socialMediaLinks,
  unmountSidebar,
}) => {
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

  const closeSidebar = link => {
    const scrim = scrimRef.current;
    const sidebar = sidebarRef.current;

    if (scrim && sidebar) {
      const onCompleteCallback = () => {
        unmountSidebar();
        if (typeof link === 'string') {
          navigate(link);
        }
      };

      TweenMax.to(scrim, animationTime, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      });
      TweenMax.to(sidebar, animationTime, {
        xPercent: -100,
        ease: Power4.easeOut,
        onComplete: onCompleteCallback,
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

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div className='sidebar-scrim' ref={scrimRef} onClick={closeSidebar}>
      <aside
        className='sidebar'
        ref={sidebarRef}
        onClick={e => e.stopPropagation()}
        {...onDrag()}
      >
        {headerContent && (
          <section className='sidebar-header'>{headerContent}</section>
        )}
        <section className='sidebar-content'>
          {sidebarLinks &&
            sidebarLinks.map(sidebarLink => (
              <span
                className={`sidebar-link button-text ${
                  location.pathname === sidebarLink.link
                    ? 'sidebar-link-active'
                    : ''
                }`.trim()}
                key={uuid()}
                onClick={() => closeSidebar(sidebarLink.link)}
              >
                {sidebarLink.name}
              </span>
            ))}
        </section>
        <section className='sidebar-footer'>
          <SocialMediaButtons socialMediaLinks={socialMediaLinks} />
          <p className='body-2'>Powered by</p>
          <p className='body-2'>The W Company</p>
        </section>
      </aside>
    </div>
  );
};

Sidebar.propTypes = {
  headerContent: PropTypes.element,
  sidebarLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      link: PropTypes.string,
    })
  ),
  socialMediaLinks: PropTypes.shape({
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    instagram: PropTypes.string,
  }),
  unmountSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
