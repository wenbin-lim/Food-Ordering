import React from 'react';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';

const MainMenuPreloader = ({ screenOrientation }) => {
  return (
    <ContentLoader
      speed={1}
      width={'100%'}
      viewBox={screenOrientation ? '0 0 1500 1500' : '0 0 1500 500'}
      backgroundColor='var(--surface1)'
      foregroundColor='var(--surface2)'
    >
      <rect x='0' y='0' rx='24' ry='24' width='400' height='48' />

      {/* <rect x='0' y='64' rx='8' ry='8' width='125' height='150' />
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
      <rect x='423' y='556' rx='8' ry='8' width='125' height='150' /> */}
    </ContentLoader>
  );
};

MainMenuPreloader.propTypes = {};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenuPreloader);
