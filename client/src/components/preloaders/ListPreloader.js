import React from 'react';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';

const ListPreloader = ({ screenOrientation }) => {
  return (
    <ContentLoader
      speed={1}
      width={'100%'}
      viewBox={screenOrientation ? '0 0 1500 1500' : '0 0 1500 500'}
      backgroundColor='var(--background)'
      foregroundColor='var(--surface1)'
    >
      <rect
        x='0'
        y='0'
        rx={screenOrientation ? '24' : '8'}
        ry={screenOrientation ? '24' : '8'}
        width='100%'
        height={screenOrientation ? '20%' : '25%'}
      />

      <rect
        x='0'
        y={screenOrientation ? '22%' : '28%'}
        rx={screenOrientation ? '24' : '8'}
        ry={screenOrientation ? '24' : '8'}
        width='100%'
        height={screenOrientation ? '20%' : '25%'}
      />

      <rect
        x='0'
        y={screenOrientation ? '44%' : '56%'}
        rx={screenOrientation ? '24' : '8'}
        ry={screenOrientation ? '24' : '8'}
        width='100%'
        height={screenOrientation ? '20%' : '25%'}
      />
    </ContentLoader>
  );
};

ListPreloader.propTypes = {};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListPreloader);
