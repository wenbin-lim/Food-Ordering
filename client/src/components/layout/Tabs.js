import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

// Misc
import sanitizeWhiteSpace from '../../utils/sanitizeWhiteSpace';

const Tabs = forwardRef(
  (
    {
      wrapper = true,
      classes,
      showHeader = true,
      headerClass,
      tabs,
      initialTabIndex = 0,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      changeTab,
    }));

    const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex);

    const tabActiveLineRef = useRef(null);

    const changeTab = newIndex =>
      newIndex >= 0 &&
      newIndex <= tabs.length - 1 &&
      setActiveTabIndex(newIndex);

    const tabsRef = useRef(null);
    const tabRef = useRef([]);

    const tabsObserverRef = useRef(
      new ResizeObserver(entries => {
        const tab = tabRef.current[0];
        const tabActiveLine = tabActiveLineRef.current;

        if (tab && tabActiveLine) {
          tabActiveLine.style.width = `${tab.offsetWidth - 1}px`;
        }
      })
    );

    useEffect(() => {
      const tabs = tabsRef.current;
      const tabsObserver = tabsObserverRef.current;

      tabs && tabsObserver.observe(tabs);

      return () => tabsObserver.unobserve(tabs);
    }, [tabsRef, tabsObserverRef]);

    const mainContent = Array.isArray(tabs) && tabs.length > 0 && (
      <Fragment>
        {showHeader && (
          <header
            className={`tabs ${headerClass ? headerClass : ''}`}
            ref={tabsRef}
          >
            {tabs.map((tab, index) => (
              <div
                key={`tab-${tab.name}-${index}`}
                className={sanitizeWhiteSpace(
                  `tab ${activeTabIndex === index ? 'tab-active' : ''}`
                )}
                ref={el => (tabRef.current[index] = el)}
                onClick={() => changeTab(index)}
              >
                {tab.icon && <div className='tab-icon'>{tab.icon}</div>}
                {tab.name && <div className='tab-name'> {tab.name}</div>}
              </div>
            ))}
            <div
              className='tab-active-line'
              style={{
                transform: `translateX(${100 * activeTabIndex}%)`,
              }}
              ref={tabActiveLineRef}
            />
          </header>
        )}
        <div className='tab-contents-wrapper'>
          <section
            className='tab-contents'
            style={{ transform: `translateX(${-100 * activeTabIndex}%)` }}
          >
            {tabs.map((tab, index) => (
              <article
                key={`tab-content-${tab.name}-${index}`}
                className={sanitizeWhiteSpace(
                  `tab-content ${tab.class ? tab.class : ''}`
                )}
                style={tab.style}
              >
                {tab.content}
              </article>
            ))}
          </section>
        </div>
      </Fragment>
    );

    return wrapper ? (
      <article
        className={sanitizeWhiteSpace(`tabs-wrapper ${classes ? classes : ''}`)}
      >
        {mainContent}
      </article>
    ) : (
      mainContent
    );
  }
);

Tabs.propTypes = {
  wrapper: PropTypes.bool,
  classes: PropTypes.string,
  showHeader: PropTypes.bool,
  headerClass: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.element,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      class: PropTypes.string,
      style: PropTypes.object,
    })
  ).isRequired,
  initialTabIndex: PropTypes.number,
};

export default Tabs;
