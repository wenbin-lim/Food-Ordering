/* eslint-disable */
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';

// Components
import Container from '../../components/layout/Container';

const WawayaDashboard = ({}) => {
  return (
    <Container
      parentContent={
        <Fragment>
          <h1 className='heading-1'>Wawaya Master</h1>
          <p>lorem1000</p>
        </Fragment>
      }
    />
  );
};

WawayaDashboard.propTypes = {};

export default WawayaDashboard;
