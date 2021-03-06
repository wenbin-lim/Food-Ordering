import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

// Components
import Spinner from '../components/layout/Spinner';

// Hooks
import useGet from '../query/hooks/useGet';

const CustomerRoute = ({ element, path, auth, children, ...rest }) => {
  const { companyName } = useParams();

  const { data: companies, isLoading: companiesLoading } = useGet('companies', {
    route: '/api/companies',
  });

  const { loading: authLoading, user } = auth;
  const { company, status } = { ...user };
  const { _id: customerCompanyId } = { ...company };

  if (companiesLoading || authLoading) {
    return <Spinner fullscreen={true} />;
  } else {
    const customerCompany = companies.find(
      company =>
        company.name === companyName && company._id === customerCompanyId
    );

    if (customerCompany && status !== 'settled') {
      if (user?.access >= 1) {
        return <Navigate to={`/${companyName}`} replace={true} />;
      } else {
        return (
          <Route
            path={path}
            element={cloneElement(element, {
              user,
              company: customerCompanyId,
              companyDetails: customerCompany,
              ...rest,
            })}
          >
            {children}
          </Route>
        );
      }
    } else {
      return <Navigate to='/' replace={true} />;
    }
  }
};

CustomerRoute.propTypes = {
  element: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerRoute);
