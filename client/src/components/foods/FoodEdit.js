import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs, { Tab } from '../layout/Tabs';
import TextInput from '../layout/TextInput';
import ImageInput from '../layout/ImageInput';
import CheckboxInput from '../layout/CheckboxInput';
import SwitchInput from '../layout/SwitchInput';
import SearchInput from '../layout/SearchInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGet from '../../query/hooks/useGet';
import useGetOne from '../../query/hooks/useGetOne';
import usePut from '../../query/hooks/usePut';
import useSearch from '../../hooks/useSearch';

const FoodEdit = ({ user }) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = tabIndex => setActiveTab(tabIndex);

  const { data: food, isLoading, error } = useGetOne('food', id, {
    route: `/api/foods/${id}`,
  });
  useErrors(error);

  const [
    editFood,
    { isLoading: requesting, error: editErrors },
  ] = usePut('foods', { route: `/api/foods/${id}` });
  const [inputErrors] = useErrors(editErrors, [
    'name',
    'price',
    'promotionPrice',
    'minQty',
    'maxQty',
    'portionSize',
    'image',
  ]);

  const [formData, setFormData] = useState({
    company: '',
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
    image: '',
    allowAdditionalInstruction: false,
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
    image,
    allowAdditionalInstruction,
    customisations,
  } = formData;

  useEffect(() => {
    if (food) {
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
      } = food;

      setFormData({
        company: company ? company : '',
        availability: typeof availability === 'boolean' ? availability : true,
        name: name ? name : '',
        price: typeof price === 'number' ? price.toString() : '',
        promotionPrice:
          typeof promotionPrice === 'number' ? promotionPrice.toString() : '',
        minQty: typeof minQty === 'number' ? minQty.toString() : '',
        maxQty: typeof maxQty === 'number' ? maxQty.toString() : '',
        desc: desc ? desc : '',
        portionSize:
          typeof portionSize === 'number' ? portionSize.toString() : '',
        preparationTime: preparationTime ? preparationTime : '',
        allergics: Array.isArray(allergics) ? allergics.join(',') : '',
        tags: Array.isArray(tags) ? tags.join(',') : '',
        allowAdditionalInstruction:
          typeof allowAdditionalInstruction === 'boolean'
            ? allowAdditionalInstruction
            : true,
        image: image ? image : '',
        customisations: Array.isArray(customisations)
          ? customisations.map(customisation => customisation._id)
          : [],
      });
    }
  }, [isLoading, food]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const editFoodSuccess = await editFood({
      ...formData,
      allergics: allergics
        ? allergics.split(',').filter(allergy => allergy.trim().length)
        : [],
      tags: tags ? tags.split(',').filter(tag => tag.trim().length) : [],
    });

    return (
      editFoodSuccess &&
      dispatch(setSnackbar(`Edited food of name '${name}'`, 'success'))
    );
  };

  const closeSideSheet = () => navigate('../../');

  // Customisations
  const { data: availableCustomisations, error: customisationsError } = useGet(
    'customisations',
    {
      route: '/api/customisations',
      params: { company },
      enabled: company,
    }
  );
  useErrors(customisationsError);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredAvailableCustomisations = useSearch(
    availableCustomisations,
    searchQuery,
    ['name']
  );
  const onSearch = query => setSearchQuery(query);

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Edit Food'} closeHandler={closeSideSheet}>
        {user.access > 2 && (
          <Tabs onClickTab={onClickTab} justifyTab='center'>
            <Tab name={'Main'} />
            <Tab name={'Customisations'} />
          </Tabs>
        )}
      </SideSheet.Header>
      <SideSheet.Content
        elementType={'form'}
        id={'foodEditForm'}
        onSubmit={onSubmit}
      >
        {user.access === 2 && (
          <SwitchInput
            label={'Availability'}
            name={'availability'}
            value={availability}
            onChangeHandler={onChange}
          />
        )}

        {user.access > 2 && activeTab === 0 && (
          <article>
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

        {user.access > 2 && activeTab === 1 && (
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
        text={'edit'}
        requesting={requesting}
        form={'foodEditForm'}
      />
    </SideSheet>
  );
};

FoodEdit.propTypes = {
  user: PropTypes.object,
};

export default FoodEdit;
