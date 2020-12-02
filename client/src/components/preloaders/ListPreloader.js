import React from 'react';

const ListPreloader = () => {
  return (
    <svg
      role='img'
      width='400'
      height='400'
      aria-labelledby='loading-aria'
      viewBox='0 0 400 400'
      preserveAspectRatio='none'
      style={{
        width: '100%',
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
          <rect x='0' y='0' width='400' height='60' />
          <rect x='0' y='68' width='400' height='60' />
          <rect x='0' y='136' width='400' height='60' />
          <rect x='0' y='204' width='400' height='60' />
          <rect x='0' y='272' width='400' height='60' />
          <rect x='0' y='340' width='400' height='60' />
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

export default ListPreloader;
