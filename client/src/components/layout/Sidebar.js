import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  Children,
  cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

// Animations
import { TweenMax } from 'gsap';

const Sidebar = forwardRef(
  ({ className, onCloseSidebar, children, ...rest }, ref) => {
    useImperativeHandle(ref, () => ({
      closeSidebar,
    }));

    const sidebarRef = useRef(null);
    const animationTime = 0.3;

    const [sidebarScrim] = useState(document.createElement('div'));
    const sidebarScrimId = 'sidebar-root';
    sidebarScrim.id = sidebarScrimId;
    sidebarScrim.classList.add('sidebar-scrim');

    var scrimBgColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--scrim');

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      document.body.appendChild(sidebarScrim);

      const sidebar = sidebarRef.current;

      if (sidebarScrim && sidebar) {
        TweenMax.to(sidebarScrim, animationTime, {
          backdropFilter: 'blur(5px)',
          backgroundColor: scrimBgColor,
        });
        TweenMax.to(sidebar, animationTime, {
          x: 0,
        });
      }

      return () => {
        document.body.removeChild(sidebarScrim);
        document.body.style.overflow = 'auto';
      };

      // eslint-disable-next-line
    }, []);

    const closeSidebar = callback => {
      const sidebar = sidebarRef.current;

      if (sidebarScrim && sidebar) {
        TweenMax.to(sidebarScrim, animationTime, {
          backdropFilter: 'blur(0px)',
          backgroundColor: 'rgba(0,0,0,0)',
        });
        TweenMax.fromTo(
          sidebar,
          animationTime,
          { x: 0 },
          {
            x: '-100%',
            onComplete: () => {
              onCloseSidebar();
              if (typeof callback === 'function') {
                callback();
              }
            },
          }
        );
      }
    };

    const onDrag = useDrag(
      ({ down, movement: [movementX] }) => {
        const sidebar = sidebarRef.current;
        const minSwipeDist = 60;

        if (sidebar && sidebarScrim) {
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
                TweenMax.to(sidebarScrim, animationTime, {
                  backdropFilter: 'blur(0px)',
                  backgroundColor: 'rgba(0,0,0,0)',
                });
                TweenMax.fromTo(
                  sidebar,
                  animationTime,
                  { x: -minSwipeDist },
                  {
                    x: '-100%',
                    onComplete: () => onCloseSidebar(),
                  }
                );
              }
            }
          }
        }
      },
      { axis: 'x' }
    );

    sidebarScrim.addEventListener('click', e => {
      if (e.target.id === sidebarScrimId) {
        closeSidebar();
      }
    });

    return createPortal(
      <aside
        className={`sidebar ${className ? className : ''}`}
        ref={sidebarRef}
        {...onDrag()}
        {...rest}
      >
        {Children.map(children, child =>
          cloneElement(child, {
            closeSidebar,
          })
        )}
      </aside>,
      sidebarScrim
    );
  }
);

Sidebar.propTypes = {
  className: PropTypes.string,
  onCloseSidebar: PropTypes.func.isRequired,
};

const Header = ({ className, closeSidebar, children, ...rest }) => {
  return (
    <header
      className={sanitizeWhiteSpace(
        `sidebar-header ${className ? className : ''}`
      )}
      {...rest}
    >
      {Children.map(children, child =>
        child?.type === SidebarLink || child?.type === SidebarLogo
          ? cloneElement(child, {
              closeSidebar,
            })
          : child
      )}
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  closeSidebar: PropTypes.func,
};

const Content = ({
  className,
  justifyContent = 'start',
  closeSidebar,
  children,
  ...rest
}) => {
  return (
    <section
      className={sanitizeWhiteSpace(
        `sidebar-content 
        ${className ? className : ''}
        sidebar-content-justify-${justifyContent}
        `
      )}
      {...rest}
    >
      {Children.map(children, child =>
        child?.type === SidebarLink || child?.type === SidebarLogo
          ? cloneElement(child, {
              closeSidebar,
            })
          : child
      )}
    </section>
  );
};

Content.propTypes = {
  className: PropTypes.string,
  justifyContent: PropTypes.oneOf([
    'start',
    'end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  closeSidebar: PropTypes.func,
};

const Footer = ({ className, closeSidebar, children, ...rest }) => {
  return (
    <footer
      className={sanitizeWhiteSpace(
        `sidebar-footer ${className ? className : ''}`
      )}
      {...rest}
    >
      {Children.map(children, child =>
        child?.type === SidebarLink || child?.type === SidebarLogo
          ? cloneElement(child, {
              closeSidebar,
            })
          : child
      )}
      <p className='body-2'>Powered by</p>
      <p className='body-2'>The W Company</p>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  closeSidebar: PropTypes.func,
};

export const SidebarLogo = ({
  logo,
  to,
  onClick,
  closeSidebar,
  invertInDarkMode = true,
}) => {
  const navigate = useNavigate();

  const onClickLogo = () => {
    if (typeof onClick === 'function') {
      closeSidebar(onClick);
    } else if (typeof to === 'string') {
      closeSidebar(navigate(to));
    }
  };

  return (
    <img
      className={sanitizeWhiteSpace(
        `sidebar-logo ${invertInDarkMode ? 'invert-in-dark-mode' : ''}`
      )}
      src={logo}
      alt={'sidebar-logo'}
      onClick={onClickLogo}
    />
  );
};

SidebarLogo.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  to: PropTypes.string,
  closeSidebar: PropTypes.func,
  invertInDarkMode: PropTypes.bool,
};

export const SidebarLink = ({ to, name, icon, closeSidebar }) => {
  const navigate = useNavigate();

  const onClick = () => {
    if (typeof to === 'string') {
      closeSidebar(navigate(to));
    }
  };

  return (
    <div className={'sidebar-link'} onClick={onClick}>
      {icon && <div className={'sidebar-link-icon'}>{icon}</div>}
      {name && <div className={'sidebar-link-name'}>{name}</div>}
    </div>
  );
};

SidebarLink.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.element,
  closeSidebar: PropTypes.func,
};

export const SideBarDivider = () => {
  return <hr className='sidebar-divider' />;
};

Sidebar.Header = Header;
Sidebar.Content = Content;
Sidebar.Footer = Footer;

export default Sidebar;
