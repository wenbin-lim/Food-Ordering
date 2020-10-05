import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  path,
  redirectLink = '/login',
  auth,
  children,
  ...rest
}) => {
  const { isAuthenticated } = auth;
  if (!isAuthenticated) {
    return <Navigate to={redirectLink}></Navigate>;
  } else {
    return (
      <Route path={path} element={<Component {...rest} auth={auth} />}>
        {children}
      </Route>
    );
  }
};

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  redirectLink: PropTypes.string,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
