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
  @name       Prop 
  @type       type
  @desc       description
  @required   true
  @default    none
*/
const Tabs = ({ tabs, initialActiveTabIndex }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveTabIndex);

  const animationTime = 0.5;
  const tabContentsRef = useRef(null);
  const tabActiveLineRef = useRef(null);

  const changeTab = index => {
    const prevActiveTabIndex = activeTabIndex;
    setActiveTabIndex(index);

    const tabContents = tabContentsRef.current;
    const tabActiveLine = tabActiveLineRef.current;

    if (tabContents) {
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
  };

  const tabsRef = useRef([]);

  useEffect(() => {
    const changeTabActiveLineWidth = () => {
      if (tabsRef.current[0] && tabActiveLineRef.current) {
        tabActiveLineRef.current.style.width = `${tabsRef.current[0].offsetWidth}px`;
      }
    };

    // init
    changeTabActiveLineWidth();
    window.addEventListener('resize', changeTabActiveLineWidth);

    return () => {
      window.removeEventListener('resize', changeTabActiveLineWidth);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <main className='tabs-container'>
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
          style={{ transform: `translateX(${-100 * activeTabIndex}%)` }}
          ref={tabContentsRef}
        >
          {tabs &&
            tabs.length > 0 &&
            tabs.map(tab => (
              <div
                className={`tab-content ${
                  tab.active ? 'tab-content-active' : ''
                }`.trim()}
                key={uuid()}
              >
                {tab.content}
              </div>
            ))}
        </section>
      </div>
    </main>
  );
};

Tabs.propTypes = {};

export default Tabs;
