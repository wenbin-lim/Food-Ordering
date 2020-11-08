import React, { useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

// Components
import Container from '../../../components/layout/Container';
import Tabs from '../../../components/layout/Tabs';
import ListPreloader from '../../../components/preloaders/ListPreloader';
import Button from '../../../components/layout/Button';
import CompanyItem from '../companies/CompanyItem';
import FoodItem from '../../../components/foods/FoodItem';
import SearchInput from '../../../components/layout/SearchInput';

// Icons
import PlusIcon from '../../../components/icons/PlusIcon';

// Actions
import { getCompany } from '../../../actions/companies';
import { getFoods } from '../../../actions/foods';

const Foods = ({
  companies: { companiesLoading, companies, requesting, company },
  foods: { foodsLoading, foods },
  getFoods,
  getCompany,
}) => {
  const onClickCompanyItem = companyId => {
    tabsRef.current.changeTab(1);
    getCompany(companyId);
    getFoods(companyId);
  };

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const onSearchCompanies = filteredResult =>
    setFilteredCompanies(filteredResult);

  const [filteredFoods, setFilteredFoods] = useState([]);
  const onSearchFoods = filteredResult => setFilteredFoods(filteredResult);

  const companyList =
    companiesLoading || !Array.isArray(companies) ? (
      <ListPreloader />
    ) : companies.length > 0 ? (
      <article className='list'>
        <header className='list-header'>
          <div className='list-header-right-content'>
            <SearchInput
              name='search'
              queryFields={['name']}
              array={companies}
              onSearch={onSearchCompanies}
            />
          </div>
        </header>
        {filteredCompanies.map((company, index) => (
          <CompanyItem
            key={company._id}
            index={index + 1}
            company={company}
            onClick={() => onClickCompanyItem(company._id)}
          />
        ))}
      </article>
    ) : (
      <p className='caption text-center'>No companies found</p>
    );

  const navigate = useNavigate();

  const foodsList = company ? (
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
              <h3 className='list-header-left-content heading-3'>
                {!requesting && company.displayedName}
              </h3>
              <div className='list-header-right-content'>
                <SearchInput
                  name='search'
                  queryFields={['name', 'tags']}
                  array={foods}
                  onSearch={onSearchFoods}
                />
              </div>
            </header>
            {filteredFoods.map(food => (
              <FoodItem key={food._id} food={food} />
            ))}
          </Fragment>
        ) : (
          <p className='caption text-center'>No food found</p>
        )}
      </article>
    </Fragment>
  ) : (
    <p className='caption text-center'>Please select a company first</p>
  );

  const tabsRef = useRef(null);

  const tabs = [
    {
      name: 'Companies',
      content: companyList,
      class: 'list-wrapper',
    },
    {
      name: 'Food',
      content: foodsList,
      class: 'list-wrapper',
    },
  ];

  return (
    <Container
      parentClass={'tabs-wrapper'}
      parentContent={<Tabs wrapper={false} ref={tabsRef} tabs={tabs} />}
      childClass={'sidesheet'}
      childContent={<Outlet />}
      parentSize={1}
      childSize={1}
    />
  );
};

Foods.propTypes = {
  companies: PropTypes.object.isRequired,
  foods: PropTypes.object.isRequired,
  getFoods: PropTypes.func.isRequired,
  getCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: state.companies,
  foods: state.foods,
});

const mapDispatchToProps = {
  getFoods,
  getCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(Foods);
