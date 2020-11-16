import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs, { Tab } from '../layout/Tabs';
import TextInput from '../layout/TextInput';
import SwitchInput from '../layout/SwitchInput';
import CheckboxInput from '../layout/CheckboxInput';
import SearchInput from '../layout/SearchInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetAll from '../../query/hooks/useGetAll';
import useGetOne from '../../query/hooks/useGetOne';
import useEditOne from '../../query/hooks/useEditOne';
import useSearch from '../../hooks/useSearch';

const MenuEdit = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const { data: menu, isLoading, error } = useGetOne('menu', id);
  useErrors(error);

  const [editMenu, { isLoading: requesting, error: editErrors }] = useEditOne(
    'menus'
  );
  const [inputErrors] = useErrors(editErrors, ['name', 'index']);

  const [formData, setFormData] = useState({
    company: '',
    name: '',
    availability: true,
    index: '',
    foods: [],
  });

  const { company, name, availability, index, foods } = formData;

  useEffect(() => {
    if (menu) {
      const { company, name, availability, index, foods } = menu;

      setFormData({
        company: company ? company : '',
        name: name ? name : '',
        availability: typeof availability === 'boolean' ? availability : true,
        index: typeof index === 'number' ? index.toString() : '',
        foods: Array.isArray(foods) ? foods.map(food => food._id) : [],
      });
    }
  }, [isLoading, menu]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const editMenuSuccess = await editMenu({
      id,
      newItem: formData,
    });

    return (
      editMenuSuccess &&
      dispatch(setSnackbar(`Edited menu of name '${name}'`, 'success'))
    );
  };

  const closeSideSheet = () => navigate('../../');

  // Foods
  const { data: availableFoods, error: foodsError } = useGetAll(
    'foods',
    { company },
    company
  );
  useErrors(foodsError);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredAvailableFoods = useSearch(availableFoods, searchQuery, [
    'name',
    'tags',
    'allergics',
  ]);
  const onSearch = query => setSearchQuery(query);

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Edit Menu'} closeHandler={closeSideSheet}>
        <Tabs onClickTab={onClickTab}>
          <Tab name={'Main'} />
          <Tab name={'Food'} />
        </Tabs>
      </SideSheet.Header>
      <SideSheet.Content
        elementType={'form'}
        id={'menuEditForm'}
        onSubmit={onSubmit}
      >
        {activeTab === 0 && (
          <article>
            <SwitchInput
              label={'Availability'}
              name={'availability'}
              value={availability}
              onChangeHandler={onChange}
              error={inputErrors.availability}
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

            <TextInput
              label={'Menu Position'}
              required={true}
              name={'index'}
              type={'numeric'}
              value={index}
              onChangeHandler={onChange}
              error={inputErrors.index}
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
        text={'edit'}
        requesting={requesting}
        form={'menuEditForm'}
      />
    </SideSheet>
  );
};

export default MenuEdit;
