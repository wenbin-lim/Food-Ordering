import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import FoodItem from '../../../components/foods/FoodItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getFoods } from '../../../actions/foods';

const CompanyFoods = ({
  userCompanyId,
  foods: { foods, foodsLoading },
  getFoods,
}) => {
  useEffect(() => {
    getFoods(userCompanyId);

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
            {foodsLoading || !Array.isArray(foods) ? (
              <ListPreloader />
            ) : foods.length > 0 ? (
              <Fragment>
                <header className='list-header'>
                  <div className='list-header-right-content'>
                    <SearchInput
                      name='search'
                      queryFields={['name']}
                      array={foods}
                      onSearch={onSearch}
                    />
                  </div>
                </header>
                {filteredResults.map(food => (
                  <FoodItem key={food._id} food={food} />
                ))}
              </Fragment>
            ) : (
              <p className='caption text-center'>No foods found</p>
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

CompanyFoods.propTypes = {
  userCompanyId: PropTypes.string.isRequired,
  foods: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  foods: state.foods,
});

const mapDispatchToProps = {
  getFoods,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyFoods);
