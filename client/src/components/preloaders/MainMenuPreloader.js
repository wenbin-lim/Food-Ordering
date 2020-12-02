import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const MainMenuPreloader = ({ screenOrientation }) => {
  return (
    <svg
      role='img'
      width='400'
      height='650'
      aria-labelledby='loading-aria'
      viewBox={screenOrientation ? '0 0 400 650' : '0 0 800 650'}
      preserveAspectRatio='none'
      style={{
        width: '100%',
        // height: 'auto',
      }}
    >
      <title id='loading-aria'>Loading...</title>
      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        clipPath='url(#clip-path)'
        style={{
          fill: 'url("#fill")',
        }}
      ></rect>
      <defs>
        <clipPath id='clip-path'>
          <rect x='0' y='0' width='200' height='32' />
          <rect
            x='0'
            y='48'
            width={screenOrientation ? '192' : '150'}
            height={screenOrientation ? '200' : '250'}
          />
          <rect
            x={screenOrientation ? '206' : '160'}
            y='48'
            width={screenOrientation ? '192' : '150'}
            height={screenOrientation ? '200' : '250'}
          />
          {!screenOrientation && (
            <Fragment>
              <rect x='320' y='48' width='150' height='250' />
              <rect x='480' y='48' width='150' height='250' />
              <rect x='640' y='48' width='150' height='250' />
            </Fragment>
          )}

          <rect
            x='0'
            y={screenOrientation ? '290' : '350'}
            width='200'
            height='32'
          />
          <rect
            x='0'
            y={screenOrientation ? '338' : '398'}
            width={screenOrientation ? '192' : '150'}
            height={screenOrientation ? '200' : '250'}
          />
          <rect
            x={screenOrientation ? '206' : '160'}
            y={screenOrientation ? '338' : '398'}
            width={screenOrientation ? '192' : '150'}
            height={screenOrientation ? '200' : '250'}
          />
          {!screenOrientation && (
            <Fragment>
              <rect
                x='320'
                y={screenOrientation ? '338' : '398'}
                width='150'
                height='250'
              />
              <rect
                x='480'
                y={screenOrientation ? '338' : '398'}
                width='150'
                height='250'
              />
              <rect
                x='640'
                y={screenOrientation ? '338' : '398'}
                width='150'
                height='250'
              />
            </Fragment>
          )}
        </clipPath>
        <linearGradient id='fill'>
          <stop offset='0.599964' stopColor='var(--background)' stopOpacity='1'>
            <animate
              attributeName='offset'
              values='-2; -2; 1'
              keyTimes='0; 0.25; 1'
              dur='2s'
              repeatCount='indefinite'
            ></animate>
          </stop>
          <stop offset='1.59996' stopColor='var(--surface1)' stopOpacity='1'>
            <animate
              attributeName='offset'
              values='-1; -1; 2'
              keyTimes='0; 0.25; 1'
              dur='2s'
              repeatCount='indefinite'
            ></animate>
          </stop>
          <stop offset='2.59996' stopColor='var(--background)' stopOpacity='1'>
            <animate
              attributeName='offset'
              values='0; 0; 3'
              keyTimes='0; 0.25; 1'
              dur='2s'
              repeatCount='indefinite'
            ></animate>
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

MainMenuPreloader.propTypes = {};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenuPreloader);
