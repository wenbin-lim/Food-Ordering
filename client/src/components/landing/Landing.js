/* eslint-disable */
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Container from '../layout/Container';

const Landing = ({}) => {
  const locationOrigin = window.location.origin;

  return (
    <Container>
      <h1 className='heading-1 text-center'>Wawaya</h1>

      {/* <p className='body-1 text-center'>This is the landing page</p>
      <a
        href={`${locationOrigin}/dinein?company=5f7e27a70374c240fc1e1a76&table=5f7e29d80374c240fc1e1a80`}
      >
        aaa company table very very cool table
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&table=5fb76e736bd40d1a9c6c0622`}
      >
        bbb company table one
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&table=5fb76e766bd40d1a9c6c0623`}
      >
        bbb company table 2
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&table=5fb76e786bd40d1a9c6c0624`}
      >
        bbb company table 3
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&asddsa=5f9c07e10ccd664fc43dbab3`}
      >
        no tableId
      </a> */}
    </Container>
  );
};

Landing.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
