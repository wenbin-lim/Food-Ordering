import React, { Fragment } from 'react';

const Preloader = ({ height = 30 }) => {
  // this preloader goes by a width:height ratio of 4:1
  return (
    <Fragment>
      <svg
        width={`${height * 4}px`}
        height={`${height}px`}
        viewBox='0 0 120 30'
        xmlns='http://www.w3.org/2000/svg'
        fill='#fff'
        className='preloader'
      >
        <circle cx='15' cy='15' r='15'>
          <animate
            attributeName='r'
            from='15'
            to='15'
            begin='0s'
            dur='0.8s'
            values='15;3;15'
            calcMode='linear'
            repeatCount='indefinite'
          />
          <animate
            attributeName='fill-opacity'
            from='1'
            to='1'
            begin='0s'
            dur='0.8s'
            values='1;.5;1'
            calcMode='linear'
            repeatCount='indefinite'
          />
        </circle>
        <circle cx='60' cy='15' r='9' fillOpacity='0.3'>
          <animate
            attributeName='r'
            from='9'
            to='9'
            begin='0s'
            dur='0.8s'
            values='9;12;15;12;9;6;3;0;3;6;9'
            calcMode='linear'
            repeatCount='indefinite'
          />
          <animate
            attributeName='fill-opacity'
            from='0.5'
            to='0.5'
            begin='0s'
            dur='0.8s'
            values='.5;1;.5'
            calcMode='linear'
            repeatCount='indefinite'
          />
        </circle>
        <circle cx='105' cy='15' r='15'>
          <animate
            attributeName='r'
            from='0'
            to='0'
            begin='0s'
            dur='0.8s'
            values='0;15;0'
            calcMode='linear'
            repeatCount='indefinite'
          />
          <animate
            attributeName='fill-opacity'
            from='1'
            to='1'
            begin='0s'
            dur='0.8s'
            values='1;.5;1'
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
