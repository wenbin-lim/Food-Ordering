import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Container from '../../../components/layout/Container';

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
export const Tables = () => {
  return (
    <Container
      parentStyle={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
      parentContent={
        <Fragment>
          <h1 className='heading-1 text-center'>tables for waiter</h1>
        </Fragment>
      }
    />
  );
};

Tables.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
