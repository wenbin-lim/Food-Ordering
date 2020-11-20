/* eslint-disable */
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Container from '../../components/layout/Container';

const Landing = ({}) => {
  const locationOrigin = window.location.origin;

  return (
    <Container>
      <h1 className='heading-1 text-center'>Wawaya</h1>

      <p className='body-1 text-center'>This is the landing page</p>
      <a
        href={`${locationOrigin}/dinein?company=5f7e27a70374c240fc1e1a76&table=5f7e29d80374c240fc1e1a80`}
      >
        aaa company table very very cool table
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&table=5f7e2a090374c240fc1e1a84`}
      >
        bbb company table 1
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&table=5f9c07e10ccd664fc43dbab3`}
      >
        bbb company table 2
      </a>
      <br />
      <a
        href={`${locationOrigin}/dinein?company=5f7e27b40374c240fc1e1a77&asddsa=5f9c07e10ccd664fc43dbab3`}
      >
        no tableId
      </a>
    </Container>
  );
};

Landing.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
