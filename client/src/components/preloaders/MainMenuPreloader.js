import React from 'react';
import ContentLoader from 'react-content-loader';

const MainMenuPreloader = props => {
  return (
    <ContentLoader
      speed={1}
      width={548}
      viewBox='0 0 548 706'
      backgroundColor='var(--surface1)'
      foregroundColor='var(--surface2)'
      style={{
        maxWidth: '100%',
      }}
      {...props}
    >
      <rect x='0' y='0' rx='24' ry='24' width='400' height='48' />

      <rect x='0' y='64' rx='8' ry='8' width='125' height='150' />
      <rect x='141' y='64' rx='8' ry='8' width='125' height='150' />
      <rect x='282' y='64' rx='8' ry='8' width='125' height='150' />
      <rect x='423' y='64' rx='8' ry='8' width='125' height='150' />

      <rect x='0' y='246' rx='24' ry='24' width='400' height='48' />

      <rect x='0' y='310' rx='8' ry='8' width='125' height='150' />
      <rect x='141' y='310' rx='8' ry='8' width='125' height='150' />
      <rect x='282' y='310' rx='8' ry='8' width='125' height='150' />
      <rect x='423' y='310' rx='8' ry='8' width='125' height='150' />

      <rect x='0' y='492' rx='24' ry='24' width='400' height='48' />

      <rect x='0' y='556' rx='8' ry='8' width='125' height='150' />
      <rect x='141' y='556' rx='8' ry='8' width='125' height='150' />
      <rect x='282' y='556' rx='8' ry='8' width='125' height='150' />
      <rect x='423' y='556' rx='8' ry='8' width='125' height='150' />
    </ContentLoader>
  );
};

export default MainMenuPreloader;
