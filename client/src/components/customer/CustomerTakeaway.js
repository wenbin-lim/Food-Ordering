/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSearchParams, Navigate, Link } from 'react-router-dom';

// Components
import Container from '../../components/layout/Container';
import Spinner from '../../components/layout/Spinner';

// Actions
import { logout } from '../../actions/auth';

const CustomerTakeaway = () => {
  const takeawayContent = <h1 className='heading-1'>Takeaway</h1>;

  return <Container parentContent={takeawayContent} />;
};

CustomerTakeaway.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerTakeaway);
