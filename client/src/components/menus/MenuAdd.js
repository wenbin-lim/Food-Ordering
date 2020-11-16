import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { queryCache } from 'react-query';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs, { Tab } from '../layout/Tabs';
import Dropdown from '../layout/Dropdown';
import TextInput from '../layout/TextInput';
import SwitchInput from '../layout/SwitchInput';
import CheckboxInput from '../layout/CheckboxInput';
import SearchInput from '../layout/SearchInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetAll from '../../query/hooks/useGetAll';
import useAddOne from '../../query/hooks/useAddOne';
import useSearch from '../../hooks/useSearch';

const MenuAdd = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const companies = queryCache.getQueryData('companies');

  const [addMenu, { isLoading: requesting, error }] = useAddOne('menus');
  const [inputErrors] = useErrors(error, ['name']);

  const [formData, setFormData] = useState({
    company: userCompanyId,
    name: '',
    availability: true,
    foods: [],
  });

  const { company, name, availability, foods } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const addMenuSuccess = await addMenu(formData);

    return (
      addMenuSuccess &&
      dispatch(setSnackbar(`Added menu of name '${name}'`, 'success'))
    );
  };

  // Foods
  const { data: availableFoods, error: foodsError, refetch } = useGetAll(
    'foods',
    {
      company,
    },
    company
  );
  useErrors(foodsError);

  useEffect(() => {
    company && refetch();

    // eslint-disable-next-line
  }, [company]);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredAvailableFoods = useSearch(availableFoods, searchQuery, [
    'name',
    'tags',
    'allergics',
  ]);
  const onSearch = query => setSearchQuery(query);

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Add Menu'} closeHandler={() => navigate('../')}>
        <Tabs onClickTab={onClickTab}>
          <Tab name={'Main'} />
          <Tab name={'Food'} />
        </Tabs>
      </SideSheet.Header>
      <SideSheet.Content
        elementType={'form'}
        id={'menuAddForm'}
        onSubmit={onSubmit}
      >
        {activeTab === 0 && (
          <article>
            {userAccess === 99 && Array.isArray(companies) && (
              <Dropdown
                required={true}
                label={'Company'}
                name={'company'}
                options={companies.map(({ _id, displayedName }) => ({
                  key: displayedName,
                  value: _id,
                }))}
                value={company}
                onChangeHandler={onChange}
              />
            )}

            <SwitchInput
              label={'Availability'}
              name={'availability'}
              value={availability}
              onChangeHandler={onChange}
            />

            <TextInput
              label={'name'}
              required={true}
              name={'name'}
              type={'text'}
              value={name}
              onChangeHandler={onChange}
              error={inputErrors.name}
            />
          </article>
        )}

        {activeTab === 1 && (
          <article>
            <SearchInput name='search' onSearch={onSearch} />
            {Array.isArray(filteredAvailableFoods) &&
            filteredAvailableFoods.length > 0 ? (
              <CheckboxInput
                name={'foods'}
                inputs={filteredAvailableFoods.map(food => ({
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
          </article>
        )}
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'add'}
        requesting={requesting}
        form={'menuAddForm'}
      />
    </SideSheet>
  );
};

MenuAdd.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default MenuAdd;
