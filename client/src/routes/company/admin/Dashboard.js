/* eslint-disable */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Container from '../../../components/layout/Container';

const Dashboard = ({}) => {
  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1 text-center'>admin dashboard</h1>
        </Fragment>
      }
    />
  );
};

Dashboard.propTypes = {};

export default Dashboard;
