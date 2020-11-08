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
  children,
  ...rest
}) => {
  const { loading, user } = auth;
  const { _id: userId, access: userAccess, company: userCompany } = { ...user };
  const { _id: userCompanyId, name: userCompanyName } = { ...userCompany };

  return loading ? (
    <Spinner fullscreen={true} />
  ) : userAccess === 99 && userCompanyName === 'wawaya' ? (
    <Route
      path={path}
      element={
        <Component
          userId={userId}
          userAccess={userAccess}
          userCompanyId={userCompanyId}
          userCompanyName={userCompanyName}
          {...rest}
        />
      }
    >
      {children}
    </Route>
  ) : (
    <Navigate to='/' replace={true} />
  );
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
