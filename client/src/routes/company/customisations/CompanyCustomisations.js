import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import CustomisationItem from '../../../components/customisations/CustomisationItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getCustomisations } from '../../../actions/customisations';

const CompanyCustomisations = ({
  userCompanyId,
  customisations: { customisations, customisationsLoading },
  getCustomisations,
}) => {
  useEffect(() => {
    getCustomisations(userCompanyId);

    // eslint-disable-next-line
  }, []);

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
            {customisationsLoading || !Array.isArray(customisations) ? (
              <ListPreloader />
            ) : customisations.length > 0 ? (
              <Fragment>
                <header className='list-header'>
                  <div className='list-header-right-content'>
                    <SearchInput
                      name='search'
                      queryFields={['name']}
                      array={customisations}
                      onSearch={onSearch}
                    />
                  </div>
                </header>
                {filteredResults.map((customisation, index) => (
                  <CustomisationItem
                    key={customisation._id}
                    index={index + 1}
                    customisation={customisation}
                  />
                ))}
              </Fragment>
            ) : (
              <p className='caption text-center'>No customisations found</p>
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

CompanyCustomisations.propTypes = {
  userCompanyId: PropTypes.string.isRequired,
  customisations: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  customisations: state.customisations,
});

const mapDispatchToProps = {
  getCustomisations,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyCustomisations);
