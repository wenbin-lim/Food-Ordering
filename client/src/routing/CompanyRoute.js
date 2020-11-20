import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Navigate, useParams } from 'react-router-dom';

// Components
import Spinner from '../components/layout/Spinner';

// Hooks
import useGet from '../query/hooks/useGet';

const CompanyRoute = ({
  element,
  path,
  access = 2,
  auth,
  children,
  ...rest
}) => {
  const { companyName } = useParams();

  const { data: companies, isLoading: companiesLoading } = useGet('companies', {
    route: '/api/companies',
  });

  const { loading: authLoading, user } = auth;
  const { company } = { ...user };
  const { _id: userCompanyId } = { ...company };

  if (companiesLoading || authLoading) {
    return <Spinner fullscreen={true} />;
  } else {
    const userCompany = companies.find(
      company => company.name === companyName && company._id === userCompanyId
    );

    if (userCompany) {
      if (user?.access >= access) {
        return (
          <Route
            path={path}
            element={cloneElement(element, {
              user,
              company: userCompanyId,
              companyDetails: userCompany,
              ...rest,
            })}
          >
            {children}
          </Route>
        );
      } else {
        return <Navigate to={`/${companyName}`} replace={true} />;
      }
    } else {
      return <Navigate to='/' replace={true} />;
    }
  }
};

CompanyRoute.propTypes = {
  element: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
  access: PropTypes.number,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyRoute);
