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
import ImageInput from '../layout/ImageInput';
import CheckboxInput from '../layout/CheckboxInput';
import SwitchInput from '../layout/SwitchInput';
import SearchInput from '../layout/SearchInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGet from '../../query/hooks/useGet';
import usePost from '../../query/hooks/usePost';
import useSearch from '../../hooks/useSearch';

const FoodAdd = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const companies = queryCache.getQueryData('companies');

  const [addFood, { isLoading: requesting, error }] = usePost('foods', {
    route: '/api/foods',
  });
  const [inputErrors] = useErrors(error, [
    'name',
    'price',
    'promotionPrice',
    'minQty',
    'maxQty',
    'portionSize',
  ]);

  const [formData, setFormData] = useState({
    company: userCompanyId,
    availability: true,
    name: '',
    price: '',
    promotionPrice: '',
    minQty: '1',
    maxQty: '1',
    desc: '',
    portionSize: '',
    preparationTime: '',
    allergics: '',
    tags: '',
    allowAdditionalInstruction: false,
    image: '',
    customisations: [],
  });

  const {
    company,
    availability,
    name,
    price,
    promotionPrice,
    minQty,
    maxQty,
    desc,
    portionSize,
    preparationTime,
    allergics,
    tags,
    allowAdditionalInstruction,
    image,
    customisations,
  } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const addFoodSuccess = await addFood({
      ...formData,
      allergics: allergics
        ? allergics.split(',').filter(allergy => allergy !== '')
        : [],
      tags: tags ? tags.split(',').filter(tag => tag !== '') : [],
    });

    return (
      addFoodSuccess &&
      dispatch(setSnackbar(`Added food of name '${name}'`, 'success'))
    );
  };

  // Customisations
  const {
    data: availableCustomisations,
    error: customisationsError,
    refetch,
  } = useGet('customisations', {
    route: '/api/customisations',
    params: { company },
    enabled: company,
  });
  useErrors(customisationsError);

  useEffect(() => {
    company && refetch();

    // eslint-disable-next-line
  }, [company]);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredAvailableCustomisations = useSearch(
    availableCustomisations,
    searchQuery,
    ['name']
  );
  const onSearch = query => setSearchQuery(query);

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Add Food'} closeHandler={() => navigate('../')}>
        <Tabs onClickTab={onClickTab}>
          <Tab name={'Main'} />
          <Tab name={'Customisations'} />
        </Tabs>
      </SideSheet.Header>
      <SideSheet.Content
        elementType={'form'}
        id={'foodAddForm'}
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
              type={'text'}
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

            <TextInput
              label={'price'}
              required={true}
              name={'price'}
              type={'number'}
              value={price}
              onChangeHandler={onChange}
              error={inputErrors.price}
            />

            <TextInput
              label={'Promotional Price (if any)'}
              name={'promotionPrice'}
              type={'number'}
              value={promotionPrice}
              onChangeHandler={onChange}
              error={inputErrors.promotionPrice}
            />

            <div className='row'>
              <div className='col pr-h'>
                <TextInput
                  label={'Min Quantity'}
                  required={true}
                  name={'minQty'}
                  type={'numeric'}
                  value={minQty}
                  onChangeHandler={onChange}
                  error={inputErrors.minQty}
                />
              </div>
              <div className='col pl-h'>
                <TextInput
                  label={'Max Quantity'}
                  required={true}
                  name={'maxQty'}
                  type={'numeric'}
                  value={maxQty}
                  onChangeHandler={onChange}
                  error={inputErrors.maxQty}
                />
              </div>
            </div>

            <TextInput
              label={'Food Description'}
              name={'desc'}
              type={'text'}
              value={desc}
              onChangeHandler={onChange}
            />

            <TextInput
              label={'Portion Size'}
              name={'portionSize'}
              type={'number'}
              value={portionSize}
              onChangeHandler={onChange}
              error={inputErrors.portionSize}
            />

            <TextInput
              label={'Food Preparation Time'}
              name={'preparationTime'}
              type={'text'}
              value={preparationTime}
              onChangeHandler={onChange}
            />

            <TextInput
              label={'Allergics'}
              name={'allergics'}
              type={'text'}
              value={allergics}
              onChangeHandler={onChange}
              informationText={'Please separate with commas'}
            />

            <TextInput
              label={'Tags'}
              name={'tags'}
              type={'text'}
              value={tags}
              onChangeHandler={onChange}
              informationText={'Please separate with commas'}
            />

            <SwitchInput
              label={'Allow Additional Instructions'}
              name={'allowAdditionalInstruction'}
              type={'allowAdditionalInstruction'}
              value={allowAdditionalInstruction}
              onChangeHandler={onChange}
            />

            <ImageInput
              label={'Food Image'}
              name={'image'}
              value={image}
              onChangeHandler={onChange}
              error={inputErrors.image}
            />
          </article>
        )}

        {activeTab === 1 && (
          <article>
            <SearchInput name='search' onSearch={onSearch} />
            {Array.isArray(filteredAvailableCustomisations) &&
            filteredAvailableCustomisations.length > 0 ? (
              <CheckboxInput
                name={'customisations'}
                inputs={filteredAvailableCustomisations.map(customisation => ({
                  key: customisation.name,
                  value: customisation._id,
                }))}
                value={customisations}
                onChangeHandler={onChange}
                ordered={true}
              />
            ) : (
              <p className='caption text-center mt-1'>
                No customisations found
              </p>
            )}
          </article>
        )}
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'add'}
        requesting={requesting}
        form={'foodAddForm'}
      />
    </SideSheet>
  );
};

FoodAdd.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default FoodAdd;
