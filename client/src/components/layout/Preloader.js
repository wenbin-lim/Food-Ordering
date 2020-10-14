import React, { Fragment } from 'react';

const Preloader = ({ height = 30 }) => {
  // this preloader goes by a width:height ratio of 4:1
  const animationDuration = 1.5;
  return (
    <Fragment>
      <svg
        width={`${height * 4}px`}
        height={`${height}px`}
        viewBox='0 0 160 40'
        xmlns='http://www.w3.org/2000/svg'
        fill='#fff'
        className='preloader'
      >
        <circle cx='20' cy='20' r='20' fillOpacity='1'>
          <animate
            attributeName='r'
            from='20'
            to='20'
            begin='0'
            dur={animationDuration}
            values='20;0;20'
            calcMode='linear'
            repeatCount='indefinite'
          />
          <animate
            attributeName='fill-opacity'
            from='1'
            to='1'
            begin='0'
            dur={animationDuration}
            values='1;0;1'
            calcMode='linear'
            repeatCount='indefinite'
          />
        </circle>
        <circle cx='80' cy='20' r='10' fillOpacity='0.5'>
          <animate
            attributeName='r'
            from='10'
            to='10'
            begin='0'
            dur={animationDuration}
            values='10;20;10;0;10'
            calcMode='linear'
            repeatCount='indefinite'
          />
          <animate
            attributeName='fill-opacity'
            from='0.5'
            to='0.5'
            begin='0'
            dur={animationDuration}
            values='.5;1;.5;0;.5'
            calcMode='linear'
            repeatCount='indefinite'
          />
        </circle>
        <circle cx='140' cy='20' r='0' fillOpacity='0'>
          <animate
            attributeName='r'
            from='0'
            to='0'
            begin='0'
            dur={animationDuration}
            values='0;20;0'
            calcMode='linear'
            repeatCount='indefinite'
          />
          <animate
            attributeName='fill-opacity'
            from='0'
            to='0'
            begin='0'
            dur={animationDuration}
            values='0;1;0'
            calcMode='linear'
            repeatCount='indefinite'
          />
        </circle>
      </svg>
    </Fragment>
  );
};

export default Preloader;

// old preloader spinning circle

/* 
  <svg
  xmlns='http://www.w3.org/2000/svg'
  width={width}
  height={height}
  viewBox='0 0 100 100'
  preserveAspectRatio='xMidYMid'
  className='preloader'
>
  <g transform='translate(80,50)'>
    <g transform='rotate(0)'>
      <circle cx='0' cy='0' r='6' fillOpacity='1'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.875s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.875s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(71.21320343559643,71.21320343559643)'>
    <g transform='rotate(45)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.875'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.75s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.75s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(50,80)'>
    <g transform='rotate(90)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.75'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.625s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.625s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(28.786796564403577,71.21320343559643)'>
    <g transform='rotate(135)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.625'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.5s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.5s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(20,50.00000000000001)'>
    <g transform='rotate(180)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.5'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.375s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.375s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(28.78679656440357,28.786796564403577)'>
    <g transform='rotate(225)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.375'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.25s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.25s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(49.99999999999999,20)'>
    <g transform='rotate(270)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.25'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='-0.125s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='-0.125s'
        ></animate>
      </circle>
    </g>
  </g>
  <g transform='translate(71.21320343559643,28.78679656440357)'>
    <g transform='rotate(315)'>
      <circle cx='0' cy='0' r='6' fillOpacity='0.125'>
        <animateTransform
          attributeName='transform'
          type='scale'
          begin='0s'
          values='1.5 1.5;1 1'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
        ></animateTransform>
        <animate
          attributeName='fill-opacity'
          keyTimes='0;1'
          dur='0.8s'
          repeatCount='indefinite'
          values='1;0'
          begin='0s'
        ></animate>
      </circle>
    </g>
  </g>
</svg>; 
*/
