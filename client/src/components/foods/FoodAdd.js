import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { getMenus } from '../../actions/menus';
import { getCustomisations } from '../../actions/customisations';
import { addFood } from '../../actions/foods';
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import Tabs from '../layout/Tabs';
import Spinner from '../layout/Spinner';
import TextInput from '../layout/TextInput';
import ImageInput from '../layout/ImageInput';
import CheckboxInput from '../layout/CheckboxInput';
import SwitchInput from '../layout/SwitchInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const FoodAdd = ({
  auth: { access: authAccess, company: authCompany },
  companies: { company },
  menus: { menus: availableMenus },
  customisations: { customisations: availableCustomisations },
  foods: { requesting, errors },
  getMenus,
  getCustomisations,
  addFood,
  setSnackbar,
}) => {
  useEffect(() => {
    let companyId =
      company && authAccess === 99 ? company._id : authCompany._id;

    getMenus(companyId);
    getCustomisations(companyId);

    // eslint-disable-next-line
  }, [authCompany, company]);

  const [inputErrorMessages] = useInputError(
    {
      name: '',
      price: '',
      promotionPrice: '',
      minQty: '',
      maxQty: '',
      portionSize: '',
      image: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
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
    menus: [],
    customisations: [],
  });

  const {
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
    menus,
    customisations,
  } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    if (authAccess === 99 && !company)
      return setSnackbar('Select a company first!', 'error');

    let companyId =
      company && authAccess === 99 ? company._id : authCompany._id;

    const addFoodSuccess = await addFood(companyId, {
      ...formData,
      allergics: allergics ? allergics.split(',').filter(el => el !== '') : [],
      tags: tags ? tags.split(',').filter(el => el !== '') : [],
    });

    return addFoodSuccess && closeSideSheet();
  };

  const closeSideSheet = () => navigate('../');

  const tabPageOne = (
    <Fragment>
      <div className='row'>
        <div className='col'>
          <SwitchInput
            label={'Availability'}
            name={'availability'}
            type={'text'}
            value={availability}
            onChangeHandler={onChange}
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
            label={'price'}
            required={true}
            name={'price'}
            type={'number'}
            value={price}
            onChangeHandler={onChange}
            error={inputErrorMessages.price}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'Promotional Price (if any)'}
            name={'promotionPrice'}
            type={'number'}
            value={promotionPrice}
            onChangeHandler={onChange}
            error={inputErrorMessages.promotionPrice}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col pr-h'>
          <TextInput
            label={'Min Quantity'}
            required={true}
            name={'minQty'}
            type={'numeric'}
            value={minQty}
            onChangeHandler={onChange}
            error={inputErrorMessages.minQty}
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
            error={inputErrorMessages.maxQty}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'Food Description'}
            name={'desc'}
            type={'text'}
            value={desc}
            onChangeHandler={onChange}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col-4 pr-h'>
          <TextInput
            label={'Portion Size'}
            name={'portionSize'}
            type={'number'}
            value={portionSize}
            onChangeHandler={onChange}
            error={inputErrorMessages.portionSize}
          />
        </div>

        <div className='col pl-h'>
          <TextInput
            label={'Food Preparation Time'}
            name={'preparationTime'}
            type={'text'}
            value={preparationTime}
            onChangeHandler={onChange}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'Allergics'}
            name={'allergics'}
            type={'text'}
            value={allergics}
            onChangeHandler={onChange}
            informationText={'Please separate with commas'}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <TextInput
            label={'Tags'}
            name={'tags'}
            type={'text'}
            value={tags}
            onChangeHandler={onChange}
            informationText={'Please separate with commas'}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <SwitchInput
            label={'Allow Additional Instructions'}
            name={'allowAdditionalInstruction'}
            type={'allowAdditionalInstruction'}
            value={allowAdditionalInstruction}
            onChangeHandler={onChange}
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <ImageInput
            label={'Food Image'}
            name={'image'}
            value={image}
            onChangeHandler={onChange}
            error={inputErrorMessages.image}
          />
        </div>
      </div>
    </Fragment>
  );

  const tabPageTwo = (
    <div className='row'>
      <div className='col'>
        {Array.isArray(availableCustomisations) &&
        availableCustomisations.length > 0 ? (
          <CheckboxInput
            name={'customisations'}
            inputs={availableCustomisations.map(customisation => ({
              key: customisation.name,
              value: customisation._id,
            }))}
            value={customisations}
            onChangeHandler={onChange}
          />
        ) : (
          <p className='caption'>No customisations found</p>
        )}
      </div>
    </div>
  );

  const tabPageThree = (
    <div className='row'>
      <div className='col'>
        {Array.isArray(availableMenus) && availableMenus.length > 0 ? (
          <CheckboxInput
            name={'menus'}
            inputs={availableMenus.map(menu => ({
              key: menu.name,
              value: menu._id,
            }))}
            value={menus}
            onChangeHandler={onChange}
          />
        ) : (
          <p className='caption'>No menus found</p>
        )}
      </div>
    </div>
  );

  const sideSheetContent = (
    <form
      id='foodAddForm'
      className='sidesheet-content tabs-wrapper p-0'
      onSubmit={onSubmit}
    >
      <Tabs
        wrapper={false}
        headerClass={'mt-1 ml-1 mr-1 mb-0'}
        tabs={[
          { name: 'Main', content: tabPageOne, class: 'p-1' },
          { name: 'Customisations', content: tabPageTwo, class: 'p-1' },
          { name: 'Menus', content: tabPageThree, class: 'p-1' },
        ]}
      />
    </form>
  );

  return (
    <SideSheet
      wrapper={false}
      headerTitle={'Add Food'}
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
          form={'foodAddForm'}
        />
      }
    />
  );
};

FoodAdd.propTypes = {
  auth: PropTypes.object.isRequired,
  foods: PropTypes.object.isRequired,
  companies: PropTypes.object.isRequired,
  menus: PropTypes.object.isRequired,
  customisations: PropTypes.object.isRequired,
  getMenus: PropTypes.func.isRequired,
  getCustomisations: PropTypes.func.isRequired,
  addFood: PropTypes.func.isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  foods: state.foods,
  companies: state.companies,
  menus: state.menus,
  customisations: state.customisations,
});

const mapDispatchToProps = {
  getMenus,
  getCustomisations,
  addFood,
  setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodAdd);
