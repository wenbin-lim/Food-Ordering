import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const WawayaRoute = ({
  component: Component,
  path,
  auth,
  children,
  ...rest
}) => {
  if (
    auth &&
    auth.access === 99 &&
    auth.company &&
    auth.company.name === 'wawaya'
  ) {
    return (
      <Route path={path} element={<Component auth={auth} {...rest} />}>
        {children}
      </Route>
    );
  }

  return <Navigate to='/' />;
};

WawayaRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaRoute);
