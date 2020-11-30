/* eslint-disable */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Container from '../layout/Container';

const CompanyLanding = () => {
  return (
    <Container>
      <h1 className='heading-1'>Company Landing</h1>
    </Container>
  );
};

CompanyLanding.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyLanding);
