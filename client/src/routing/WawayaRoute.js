import React, { cloneElement } from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Spinner from '../components/layout/Spinner';

const WawayaRoute = ({ element, path, auth, children, ...rest }) => {
  const { loading, user } = auth;
  const { company } = { ...user };
  const { _id: companyId, name: companyName } = { ...company };

  return loading ? (
    <Spinner fullscreen={true} />
  ) : user?.access === 99 && companyName === 'wawaya' ? (
    <Route
      path={path}
      element={cloneElement(element, {
        user,
        company: companyId,
        ...rest,
      })}
    >
      {children}
    </Route>
  ) : (
    <Navigate to='/' replace={true} />
  );
};

WawayaRoute.propTypes = {
  element: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WawayaRoute);
