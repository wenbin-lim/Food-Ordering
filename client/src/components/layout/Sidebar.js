import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Component
import SocialMediaButtons from './SocialMediaButtons';

// Animations
import { TweenMax } from 'gsap';

const Sidebar = forwardRef(
  (
    {
      headerClasses,
      headerContent,
      sidebarLinks,
      socialMediaLinks,
      unmountSidebarHandler,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      closeSidebar,
    }));

    const [animationTime] = useState(0.3);

    const scrimRef = useRef(null);
    const sidebarRef = useRef(null);

    const container = document.getElementById('sidebar-root');

    var scrimBgColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--scrim');

    useEffect(() => {
      document.body.style.overflow = 'hidden';

      const scrim = scrimRef.current;
      const sidebar = sidebarRef.current;

      if (scrim && sidebar) {
        TweenMax.to(scrim, animationTime, {
          backdropFilter: 'blur(5px)',
          backgroundColor: scrimBgColor,
        });
        TweenMax.to(sidebar, animationTime, {
          x: 0,
        });
      }

      return () => (document.body.style.overflow = 'auto');

      // eslint-disable-next-line
    }, []);

    const closeSidebar = (path = false, sidebarCurrXPos = 0) => {
      const scrim = scrimRef.current;
      const sidebar = sidebarRef.current;

      if (scrim && sidebar) {
        TweenMax.to(scrim, animationTime, {
          backdropFilter: 'blur(0px)',
          backgroundColor: 'rgba(0,0,0,0)',
        });
        TweenMax.fromTo(
          sidebar,
          animationTime,
          { x: sidebarCurrXPos },
          {
            x: '-100%',
            onComplete: () => {
              unmountSidebarHandler();
              if (typeof path === 'string') {
                navigate(path);
              }
            },
          }
        );
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
                TweenMax.fromTo(sidebar, 0.1, { x: movementX }, { x: 0 });
              } else {
                closeSidebar(false, -minSwipeDist);
              }
            }
          }
        }
      },
      { axis: 'x' }
    );

    const navigate = useNavigate();

    return createPortal(
      <div className='sidebar-scrim' ref={scrimRef} onClick={closeSidebar}>
        <aside
          className='sidebar'
          ref={sidebarRef}
          onClick={e => e.stopPropagation()}
          {...onDrag()}
        >
          {headerContent && (
            <header
              className={sanitizeWhiteSpace(
                `sidebar-header ${headerClasses ? headerClasses : ''}`
              )}
            >
              {headerContent}
            </header>
          )}
          <section className='sidebar-content'>
            {sidebarLinks &&
              sidebarLinks.map((link, index) =>
                typeof link.divider === 'boolean' && link.divider ? (
                  <hr
                    key={`sidebar-divider-${index}`}
                    className='sidebar-content-divider'
                  />
                ) : (
                  <div
                    key={`sidebar-link-to-${link.path}-${index}`}
                    className='sidebar-link-group'
                    onClick={() => closeSidebar(link.path)}
                  >
                    {link.icon && (
                      <div className='sidebar-link-icon'>{link.icon}</div>
                    )}
                    <div className='sidebar-link'>{link.name}</div>
                  </div>
                )
              )}
          </section>
          {socialMediaLinks && (
            <footer className='sidebar-footer'>
              <SocialMediaButtons socialMediaLinks={socialMediaLinks} />
              <p className='body-2'>Powered by</p>
              <p className='body-2'>The W Company</p>
            </footer>
          )}
        </aside>
      </div>,
      container
    );
  }
);

Sidebar.propTypes = {
  headerClasses: PropTypes.string,
  headerContent: PropTypes.element,
  sidebarLinks: PropTypes.arrayOf(
    PropTypes.shape({
      divider: PropTypes.bool,
      icon: PropTypes.element,
      name: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  socialMediaLinks: PropTypes.shape({
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    instagram: PropTypes.string,
  }),
  unmountSidebarHandler: PropTypes.func.isRequired,
};

export default Sidebar;
