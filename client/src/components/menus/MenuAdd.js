import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { getFoods } from '../../actions/foods';
import { addMenu } from '../../actions/menus';
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs from '../layout/Tabs';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';
import SwitchInput from '../layout/SwitchInput';
import CheckboxInput from '../layout/CheckboxInput';
import SearchInput from '../layout/SearchInput';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const MenuAdd = ({
  auth: { access: authAccess, company: authCompany },
  companies: { company },
  foods: { foods: availableFoods },
  menus: { requesting, errors },
  getFoods,
  addMenu,
  setSnackbar,
}) => {
  useEffect(() => {
    let companyId =
      company && authAccess === 99 ? company._id : authCompany._id;

    getFoods(companyId);

    // eslint-disable-next-line
  }, [authCompany, company]);

  const [inputErrorMessages] = useInputError({ name: '' }, errors);

  const [formData, setFormData] = useState({
    name: '',
    availability: true,
    isMain: false,
    foods: [],
  });

  const { name, availability, isMain, foods } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    if (authAccess === 99 && !company)
      return setSnackbar('Select a company first!', 'error');

    let companyId =
      company && authAccess === 99 ? company._id : authCompany._id;

    const addMenuSuccess = await addMenu(companyId, formData);

    return addMenuSuccess && navigate('../', { replace: true });
  };

  const closeSideSheet = () => navigate('../');

  const tabPageOne = (
    <Fragment>
      <div className='row'>
        <div className='col'>
          <SwitchInput
            label={'Availability'}
            name={'availability'}
            value={availability}
            onChangeHandler={onChange}
            error={inputErrorMessages.availability}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'name'}
            required={true}
            name={'name'}
            type={'text'}
            value={name}
            onChangeHandler={onChange}
            error={inputErrorMessages.name}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <SwitchInput
            label={'Display in main menu page'}
            name={'isMain'}
            value={isMain}
            onChangeHandler={onChange}
            error={inputErrorMessages.isMain}
          />
        </div>
      </div>
    </Fragment>
  );

  const [filteredFood, setFilteredFood] = useState([]);
  const onSearch = filteredResult => setFilteredFood(filteredResult);

  const tabPageTwo = (
    <div className='row'>
      <div className='col'>
        <SearchInput
          name='search'
          queryFields={['name', 'tags', 'allergics']}
          array={availableFoods}
          onSearch={onSearch}
        />
        {Array.isArray(filteredFood) && filteredFood.length > 0 ? (
          <CheckboxInput
            name={'foods'}
            inputs={filteredFood.map(food => ({
              key: food.name,
              value: food._id,
            }))}
            value={foods}
            onChangeHandler={onChange}
          />
        ) : (
          <p className='caption text-center mt-1'>No food found</p>
        )}
      </div>
    </div>
  );

  const sideSheetContent = (
    <form
      id='menuAddForm'
      className='sidesheet-content tabs-wrapper p-0'
      onSubmit={onSubmit}
    >
      <Tabs
        wrapper={false}
        headerClass={'mt-1 ml-1 mr-1 mb-0'}
        tabs={[
          { name: 'Main', content: tabPageOne, class: 'p-1' },
          { name: 'Food', content: tabPageTwo, class: 'p-1' },
        ]}
      />
    </form>
  );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={'Add Menu'}
      closeSideSheetHandler={closeSideSheet}
      contentWrapper={false}
      content={sideSheetContent}
      footerBtn={
        <Button
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          text={'add'}
          icon={
            requesting ? (
              <Spinner height={'1.5rem'} />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          disabled={requesting}
          submit={true}
          form={'menuAddForm'}
        />
      }
    />
  );
};

MenuAdd.propTypes = {
  auth: PropTypes.object.isRequired,
  foods: PropTypes.object.isRequired,
  menus: PropTypes.object.isRequired,
  companies: PropTypes.object,
  getFoods: PropTypes.func.isRequired,
  addMenu: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  foods: state.foods,
  menus: state.menus,
  companies: state.companies,
});

const mapDispatchToProps = {
  getFoods,
  addMenu,
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuAdd);
