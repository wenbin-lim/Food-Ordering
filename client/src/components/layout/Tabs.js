import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  Children,
  createElement,
  cloneElement,
} from 'react';
import PropTypes from 'prop-types';

// Misc
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

/* 
  using tabs-header only
  ----------------------
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  {activeTab === 0 && <div>Tab One</div>}
  {activeTab === 1 && <div>Tab Two</div>}
*/
const Tabs = forwardRef(
  (
    {
      className,
      initialActive = 0,
      justifyTab = 'start',
      onClickTab,
      headerOnly = false,
      children,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      setActiveTab,
    }));

    const [activeTab, setActiveTab] = useState(initialActive);

    return (
      <section
        className={sanitizeWhiteSpace(
          `tabs 
          ${headerOnly ? 'tabs-header-only' : ''}
          ${className ? className : ''}
          `
        )}
      >
        <header
          className={sanitizeWhiteSpace(
            `tabs-header ${`tabs-justify-${justifyTab}`}`
          )}
        >
          {Children.map(
            children,
            (child, index) =>
              child?.type === Tab &&
              createElement(
                'div',
                {
                  key: `tab-name-${index}`,
                  className: sanitizeWhiteSpace(
                    `tab-name ${activeTab === index ? 'active' : ''}`
                  ),
                  onClick: () => {
                    setActiveTab(index);
                    typeof onClickTab === 'function' && onClickTab(index);
                  },
                },
                child.props?.name ? child.props.name : 'No name'
              )
          )}
        </header>
        {!headerOnly &&
          Children.map(
            children,
            (child, index) =>
              child?.type === Tab &&
              cloneElement(child, {
                key: `tab-content-${index}`,
                className: sanitizeWhiteSpace(
                  `${child?.props?.className ? child.props.className : ''} ${
                    activeTab !== index ? 'hidden' : ''
                  }`
                ),
              })
          )}
      </section>
    );
  }
);

Tabs.propTypes = {
  className: PropTypes.string,
  initialActive: PropTypes.number,
  justifyTab: PropTypes.oneOf([
    'start',
    'end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  onClickTab: PropTypes.func,
  headerOnly: PropTypes.bool,
};

export const Tab = ({
  elementType = 'article',
  name,
  className,
  children,
  ...rest
}) => {
  return createElement(
    elementType,
    {
      className: sanitizeWhiteSpace(
        `tab-content ${className ? className : ''}`
      ),
      ...rest,
    },
    children
  );
};

Tab.propTypes = {
  elementType: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
};

export default Tabs;
