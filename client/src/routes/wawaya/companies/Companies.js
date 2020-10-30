import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import CompanyItem from './CompanyItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

const Companies = ({ companies: { companies, companiesLoading } }) => {
  const navigate = useNavigate();

  const [filteredResults, setFilteredResults] = useState([]);
  const onSearch = filteredResult => setFilteredResults(filteredResult);

  return (
    <Container
      parentClass={'list-wrapper'}
      parentContent={
        <Fragment>
          <Button
            classes={'list-add-btn'}
            fill={'contained'}
            type={'primary'}
            icon={<PlusIcon />}
            onClick={() => navigate('add')}
          />

          <article className='list'>
            {companiesLoading || !Array.isArray(companies) ? (
              <ListPreloader />
            ) : companies.length > 0 ? (
              <Fragment>
                <header className='list-header'>
                  <div className='list-header-right-content'>
                    <SearchInput
                      name='search'
                      queryFields={['name']}
                      array={companies}
                      onSearch={onSearch}
                    />
                  </div>
                </header>
                {filteredResults.map((company, index) => (
                  <CompanyItem
                    key={company._id}
                    index={index + 1}
                    company={company}
                  />
                ))}
              </Fragment>
            ) : (
              <p className='caption text-center'>No companies found</p>
            )}
          </article>
        </Fragment>
      }
      childClass={'sidesheet'}
      childContent={<Outlet />}
      parentSize={3}
      childSize={2}
    />
  );
};

Companies.propTypes = {
  companies: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
