import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Preloader from '../../../components/layout/Preloader';
import Button from '../../../components/layout/Button';
import CompanyItem from './CompanyItem';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getCompanies } from '../../../actions/companies';

/* 
  =====
  Props
  =====
  @name       companies 
  @type       object
  @desc       app level companies state
  @required   true

  @name       getCompanies 
  @type       function
  @desc       redux action to get all companies
  @required   true
*/
export const Companies = ({
  companies: { companies, companiesLoading },
  getCompanies,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    /* Functions to run on mount */
    getCompanies();

    // eslint-disable-next-line
  }, []);

  return (
    <Container
      parentContent={
        <Fragment>
          <Button
            btnStyle={'contained'}
            type={'primary'}
            text={'company'}
            icon={<PlusIcon />}
            leadingIcon={true}
            additionalStyles={{
              marginLeft: 'auto',
              marginBottom: '1rem',
            }}
            onClick={() => navigate('add')}
          />
          {companiesLoading ? (
            <Preloader height={24} />
          ) : companies && companies.length > 0 ? (
            companies.map((company, index) => (
              <CompanyItem
                key={company._id}
                index={index + 1}
                company={company}
              />
            ))
          ) : (
            <p className='caption text-center'>No companies found</p>
          )}
        </Fragment>
      }
      childContent={<Outlet />}
      parentSize={3}
      childSize={2}
      parentStyle={{ paddingBottom: '2rem' }}
    />
  );
};

Companies.propTypes = {
  companies: PropTypes.object.isRequired,
  getCompanies: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
});

const mapDispatchToProps = {
  getCompanies,
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
