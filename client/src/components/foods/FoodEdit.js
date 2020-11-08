import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Actions
import { getMenus } from '../../actions/menus';
import { getCustomisations } from '../../actions/customisations';
import { getFood, editFood } from '../../actions/foods';

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

const FoodEdit = ({
  menus: { menus: availableMenus },
  customisations: { customisations: availableCustomisations },
  foods: { requesting, food, errors },
  getFood,
  getMenus,
  getCustomisations,
  editFood,
}) => {
  let { id } = useParams();

  useEffect(() => {
    getFood(id);

    // eslint-disable-next-line
  }, [id]);

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
    image: '',
    allowAdditionalInstruction: false,
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
    image,
    allowAdditionalInstruction,
    menus,
    customisations,
  } = formData;

  useEffect(() => {
    const {
      _id: foodId,
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
      company,
    } = { ...food };

    if (foodId === id) {
      getMenus(company);
      getCustomisations(company);

      setFormData({
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
        menus: Array.isArray(menus) ? menus : [],
        customisations: Array.isArray(customisations) ? customisations : [],
      });
    }

    // eslint-disable-next-line
  }, [food, id]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();

    const editFoodSuccess = await editFood(id, {
      ...formData,
      allergics: allergics ? allergics.split(',').filter(el => el !== '') : [],
      tags: tags ? tags.split(',').filter(el => el !== '') : [],
    });

    return editFoodSuccess && navigate('../');
  };

  const closeSideSheet = () => navigate('../../');

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
        <h3 className='heading-3'>Customisations</h3>
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
            ordered={true}
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
        <h3 className='heading-3'>Group food under</h3>
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
      id='foodEditForm'
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
      headerTitle={'Edit Food'}
      closeSideSheetHandler={closeSideSheet}
      contentWrapper={false}
      content={food && food._id !== id ? <Spinner /> : sideSheetContent}
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
          form={'foodEditForm'}
        />
      }
    />
  );
};

FoodEdit.propTypes = {
  foods: PropTypes.object.isRequired,
  menus: PropTypes.object.isRequired,
  customisations: PropTypes.object.isRequired,
  getFood: PropTypes.func.isRequired,
  getMenus: PropTypes.func.isRequired,
  getCustomisations: PropTypes.func.isRequired,
  editFood: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  foods: state.foods,
  menus: state.menus,
  customisations: state.customisations,
});

const mapDispatchToProps = {
  getFood,
  getMenus,
  getCustomisations,
  editFood,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodEdit);
