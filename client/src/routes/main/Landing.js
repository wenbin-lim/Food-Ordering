/* eslint-disable */
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Container from '../../components/layout/Container';

const Landing = ({}) => {
  return (
    <Container toWhat='test'>
      <div>
        1
        <div>
          2<div>3</div>
        </div>
      </div>
      {/* <h1 className='heading-1 text-center'>Wawaya</h1>

      <p className='body-1 text-center'>This is the landing page</p>
      <a href='http://localhost:3000/dinein?company=5f7e27b40374c240fc1e1a77&table=5fa1c5dec884972e004bcc21'>
        link
      </a> */}
    </Container>
  );
};

Landing.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
