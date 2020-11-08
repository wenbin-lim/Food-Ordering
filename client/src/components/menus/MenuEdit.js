import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getFoods } from '../../actions/foods';
import { getMenu, editMenu } from '../../actions/menus';

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

const MenuEdit = ({
  menus: { requesting, menu, errors },
  foods: { foods: availableFoods },
  getMenu,
  getFoods,
  editMenu,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getMenu(id);

    // eslint-disable-next-line
  }, [id]);

  const [inputErrorMessages] = useInputError(
    {
      name: '',
      index: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
    name: '',
    availability: true,
    index: '',
    foods: [],
  });

  const { name, availability, index, foods } = formData;

  useEffect(() => {
    let { _id: menuId, name, availability, index, foods, company } = {
      ...menu,
    };

    if (menuId === id) {
      getFoods(company);

      setFormData({
        name: name ? name : '',
        availability: typeof availability === 'boolean' ? availability : true,
        index: typeof index === 'number' ? index.toString() : index,
        foods: Array.isArray(foods) ? foods.map(food => food._id) : [],
      });
    }

    // eslint-disable-next-line
  }, [menu, id]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const editMenuSuccess = await editMenu(id, formData);

    return editMenuSuccess && navigate('../');
  };

  const closeSideSheet = () => navigate('../../');

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
          <TextInput
            label={'Menu Position'}
            required={true}
            name={'index'}
            type={'numeric'}
            value={index}
            onChangeHandler={onChange}
            error={inputErrorMessages.index}
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
            ordered={true}
          />
        ) : (
          <p className='caption text-center mt-1'>No food found</p>
        )}
      </div>
    </div>
  );

  const sideSheetContent = (
    <form
      id='menuEditForm'
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
      headerTitle={'Edit Menu'}
      closeSideSheetHandler={closeSideSheet}
      contentWrapper={false}
      content={menu && menu._id !== id ? <Spinner /> : sideSheetContent}
      footerBtn={
        <Button
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          text={'edit'}
          icon={
            requesting ? (
              <Spinner height={'1.5rem'} />
            ) : (
              <ArrowIcon direction='right' />
            )
          }
          disabled={requesting}
          submit={true}
          form={'menuEditForm'}
        />
      }
    />
  );
};

MenuEdit.propTypes = {
  menus: PropTypes.object.isRequired,
  foods: PropTypes.object.isRequired,
  getMenu: PropTypes.func.isRequired,
  getFoods: PropTypes.func.isRequired,
  editMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  foods: state.foods,
  menus: state.menus,
});

const mapDispatchToProps = {
  getMenu,
  getFoods,
  editMenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuEdit);
