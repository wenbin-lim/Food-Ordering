import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-use-gesture';

// Misc
import { v4 as uuid } from 'uuid';

// Animations
import { TweenMax, Power4 } from 'gsap';

/* 
  =====
  Props
  =====
  @name       tabs 
  @type       array of object {name: String , icon(optional), content: jsx, style, class }
  @desc       tabs to be generated
  @required   true

  @name       currentTabIndex 
  @type       number
  @desc       denotes which tab would be intially shown
  @required   false
  @default    0
*/
const Tabs = ({ tabs, currentTabIndex = 0, tabContentsWillSlide = true }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(currentTabIndex);

  const animationTime = 0.5;
  const tabContentsRef = useRef(null);
  const tabActiveLineRef = useRef(null);

  const changeTab = index => {
    const prevActiveTabIndex = activeTabIndex;
    setActiveTabIndex(index);

    const tabContents = tabContentsRef.current;
    const tabActiveLine = tabActiveLineRef.current;

    if (tabContents && tabActiveLine) {
      TweenMax.fromTo(
        tabActiveLine,
        animationTime,
        {
          x: `${100 * prevActiveTabIndex}%`,
        },
        {
          x: `${100 * index}%`,
        }
      );
      if (tabContentsWillSlide) {
        TweenMax.fromTo(
          tabContents,
          animationTime,
          {
            x: `${-100 * prevActiveTabIndex}%`,
          },
          {
            x: `${-100 * index}%`,
          }
        );
      }
    }
  };

  useEffect(() => {
    if (currentTabIndex !== activeTabIndex) {
      changeTab(currentTabIndex);
    }
  }, [currentTabIndex]);

  const tabsRef = useRef([]);

  const tabContainerObserver = useRef(
    new ResizeObserver(entries => {
      const tab = tabsRef.current[0];
      const tabActiveLine = tabActiveLineRef.current;

      if (tabs && tabActiveLine) {
        tabActiveLine.style.width = `${tab.offsetWidth - 1}px`;
      }
    })
  );

  const tabContainerRef = useRef(null);

  useEffect(() => {
    const tabContainer = tabContainerRef.current;

    if (tabContainer) {
      tabContainerObserver.current.observe(tabContainer);
    }

    return () => {
      tabContainerObserver.current.unobserve(tabContainer);
    };
  }, [tabContainerRef, tabContainerObserver]);

  return (
    <main className='tabs-container' ref={tabContainerRef}>
      <section className='tabs'>
        {tabs &&
          tabs.length > 0 &&
          tabs.map((tab, index) => (
            <div
              className={`tab ${
                activeTabIndex === index ? 'tab-active' : ''
              }`.trim()}
              key={uuid()}
              onClick={() => changeTab(index)}
              ref={el => (tabsRef.current[index] = el)}
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
      </section>
      <div className='tab-contents-wrapper'>
        <section
          className='tab-contents'
          style={{
            transform: tabContentsWillSlide
              ? `translateX(${-100 * activeTabIndex}%)`
              : null,
          }}
          ref={tabContentsRef}
        >
          {tabs &&
            tabs.length > 0 &&
            tabs.map((tab, index) => (
              <div
                className={`tab-content ${
                  !tabContentsWillSlide
                    ? activeTabIndex === index
                      ? 'tab-content-wont-slide-active'
                      : 'tab-content-wont-slide'
                    : ''
                } ${tab.class ? tab.class : ''}`.trim()}
                key={uuid()}
                style={tab.style ? tab.style : null}
              >
                {tab.content}
              </div>
            ))}
        </section>
      </div>
    </main>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.element,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
      class: PropTypes.string,
      style: PropTypes.object,
    }).isRequired
  ).isRequired,
};

export default Tabs;
