import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Spinner from '../components/layout/Spinner';

const WawayaRoute = ({
  component: Component,
  path,
  auth,
  loading,
  access,
  authCompany,
  children,
  ...rest
}) => {
  return loading ? (
    <Spinner fullscreen={true} />
  ) : access === 99 && authCompany && authCompany.name === 'wawaya' ? (
    <Route path={path} element={<Component auth={auth} {...rest} />}>
      {children}
    </Route>
  ) : (
    <Navigate to='/' />
  );
};

WawayaRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  access: PropTypes.number.isRequired,
  authCompany: PropTypes.object,
};

const mapStateToProps = state => ({
  auth: state.auth,
  loading: state.auth.loading,
  access: state.auth.access,
  authCompany: state.auth.company,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaRoute);
