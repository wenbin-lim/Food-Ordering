import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  path,
  redirectLink = '/',
  auth,
  access,
  children,
  ...rest
}) => {
  const { table, user, access: authAccessLevel } = auth;

  if (table || user) {
    if (typeof access === 'number') {
      if (authAccessLevel >= access) {
        return (
          <Route path={path} element={<Component {...rest} />}>
            {children}
          </Route>
        );
      }
    } else {
      return (
        <Route path={path} element={<Component {...rest} />}>
          {children}
        </Route>
      );
    }
  }

  return <Navigate to={redirectLink}></Navigate>;
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
