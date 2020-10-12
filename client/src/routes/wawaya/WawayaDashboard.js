import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Components
import Container from '../../components/layout/Container';

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
const WawayaDashboard = ({}) => {
  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1'>Wawaya Master</h1>
          <Link to='/'>213</Link>
        </Fragment>
      }
    />
  );
};

WawayaDashboard.propTypes = {};

export default WawayaDashboard;
