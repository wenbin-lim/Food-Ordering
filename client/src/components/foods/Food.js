import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Flippable from '../layout/Flippable';
import Button from '../layout/Button';
import CheckboxInput from '../layout/CheckboxInput';
import RadioInput from '../layout/RadioInput';
import TextInput from '../layout/TextInput';
import Spinner from '../layout/Spinner';

// Icons
import ImageIcon from '../icons/ImageIcon';
import CloseIcon from '../icons/CloseIcon';
import ArrowIcon from '../icons/ArrowIcon';
import PlusIcon from '../icons/PlusIcon';
import MinusIcon from '../icons/MinusIcon';

// Actions
import { setSnackbar } from '../../actions/app';
import { addOrder } from '../../actions/customer';

// Custom Hooks
import useInputError from '../../hooks/useInputError';

const Food = ({
  food,
  edit,
  unmountHandler,
  setSnackbar,
  auth: { user },
  customer: { table, bill, requesting, errors },
  addOrder,
}) => {
  const {
    _id: foodId,
    name,
    price,
    promotionPrice,
    image,
    desc,
    portionSize,
    allergics,
    preparationTime,
    customisations: availableCustomisations,
    minQty,
    maxQty,
    allowAdditionalInstruction,
    company: foodCompanyId,
  } = food;

  const hasBackFace =
    (Array.isArray(availableCustomisations) &&
      availableCustomisations.length > 0) ||
    allowAdditionalInstruction;

  const foodPrice = promotionPrice ? promotionPrice : price;
  const [additionalPrice, setAdditionalPrice] = useState(0);

  const [foodQty, setFoodQty] = useState(minQty);

  const updateFoodQty = increment =>
    increment ? setFoodQty(foodQty + 1) : setFoodQty(foodQty - 1);

  const updateQtyGroup = (
    <section className='food-quantity-group'>
      <Button
        classes={'food-quantity-btn'}
        fill={'contained'}
        type={'primary'}
        icon={<MinusIcon />}
        onClick={() => updateFoodQty(false)}
        disabled={foodQty === minQty}
      />
      <div className='food-quantity'>{foodQty}</div>
      <Button
        classes={'food-quantity-btn'}
        fill={'contained'}
        type={'primary'}
        icon={<PlusIcon />}
        onClick={() => updateFoodQty(true)}
        disabled={foodQty === maxQty}
      />
    </section>
  );

  const flippableRef = useRef(null);
  const flipCard = () => flippableRef.current && flippableRef.current.flip();

  const [inputErrorMessages] = useInputError(
    {
      ...availableCustomisations
        .filter(customisation => customisation.availability)
        .reduce((result, customisation) => {
          result[customisation._id] = '';
          return result;
        }, {}),
      additionalInstruction: '',
    },
    errors
  );

  const [formData, setFormData] = useState({
    additionalInstruction: '',
    customisations: {
      ...availableCustomisations
        .filter(customisation => customisation.availability)
        .reduce((result, customisation) => {
          result[customisation._id] = customisation.max === 1 ? '' : [];
          return result;
        }, {}),
    },
  });

  useEffect(() => {
    if (edit) {
      const { quantity, customisations, additionalInstruction } = edit;

      setFoodQty(quantity);

      let editCustomisations = {};
      customisations.forEach(editCustomisation => {
        const { customisation, optionsChosen } = editCustomisation;
        const {
          _id: customisationId,
          options: availableOptions,
          max: customisationMax,
        } = {
          ...customisation,
        };

        let value = [];

        if (Array.isArray(availableOptions) && availableOptions.length > 0) {
          optionsChosen.forEach(chosenOptionId => {
            const foundOption = availableOptions.find(
              option => option._id.toString() === chosenOptionId.toString()
            );

            if (typeof customisationMax === 'number' && customisationMax > 1) {
              value.push(`${chosenOptionId},${foundOption.price}`);
            } else {
              value = `${chosenOptionId},${foundOption.price}`;
            }
          });
        }

        editCustomisations[customisationId] = value;
      });

      setFormData({
        ...formData,
        additionalInstruction,
        customisations: {
          ...formData.customisations,
          ...editCustomisations,
        },
      });
    }

    // eslint-disable-next-line
  }, [edit]);

  const { additionalInstruction, customisations } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onCustomisationChange = ({ name, value }) => {
    let { customisations } = formData;
    customisations = {
      ...customisations,
      [name]: value,
    };

    setFormData({ ...formData, customisations });

    let newAdditionalPrice = 0;
    let customisationsArr = Object.values(customisations);

    customisationsArr.forEach(selectedOptions => {
      if (Array.isArray(selectedOptions)) {
        // checkbox
        selectedOptions.forEach(selectedOption => {
          const [, optionPrice] = selectedOption.split(',');
          newAdditionalPrice += parseFloat(optionPrice);
        });
      } else {
        // radio
        if (selectedOptions) {
          const [, optionPrice] = selectedOptions.split(',');
          newAdditionalPrice += parseFloat(optionPrice);
        }
      }
    });

    setAdditionalPrice(newAdditionalPrice);
  };

  const addToCart = async () => {
    // staff/user and customer can add cart
    // check if user or customer
    // if user, allow selection of table
    // if customer just add
    const totalPrice = (foodPrice + additionalPrice) * foodQty;
    if (user) {
      let userCompanyId = user?.company?._id;
      if (userCompanyId === foodCompanyId) {
        console.log(
          'staff adding food, show another dialog to show which table to add to'
        );
      }
    } else if (table && bill) {
      let tableCompanyId = table?.company?._id;
      const { _id: billId } = bill;
      if (tableCompanyId === foodCompanyId) {
        const orderId = edit ? edit.orderId : false;

        const addSuccess = await addOrder(
          billId,
          orderId,
          foodId,
          foodQty,
          totalPrice,
          additionalInstruction,
          customisations
        );

        return addSuccess && unmountHandler();
      }
    }
  };

  const frontFace = (
    <Fragment>
      <section className='food-front-image'>
        {image ? (
          <img src={image} alt={`${name}-foodimage-${foodId}`} />
        ) : (
          <ImageIcon width={128} />
        )}
        <Button
          classes={'food-close-btn'}
          icon={<CloseIcon />}
          onClick={unmountHandler}
        />
      </section>
      <section className='food-front-content'>
        <header className='food-front-content-header'>
          <h1 className='food-front-name'>{name ? name : 'No name defined'}</h1>
          {typeof portionSize === 'number' && (
            <p className='food-front-portionsize'>For {portionSize}</p>
          )}
        </header>
        <section className='food-front-content-body'>
          {desc && <section className='food-front-desc'>{desc}</section>}
          {Array.isArray(allergics) && allergics.length > 0 && (
            <section className='food-front-allergics'>
              {allergics.map((allergy, index) => (
                <span
                  key={`${foodId}-food-${name}-allergics-${allergy}-${index}`}
                  className='chip'
                >
                  {allergy}
                </span>
              ))}
            </section>
          )}
          {preparationTime && (
            <section className='food-front-preparationtime'>
              {preparationTime}
            </section>
          )}
        </section>
        <footer className='food-front-content-footer'>
          {!hasBackFace && updateQtyGroup}
          <Button
            classes={'food-bottom-btn'}
            fill={'contained'}
            type={'primary'}
            block={true}
            blockBtnBottom={true}
            additionalContentClasses={'food-price'}
            additionalContent={`$${(
              (foodPrice + additionalPrice) *
              foodQty
            ).toFixed(2)}`}
            text={hasBackFace ? 'More' : 'Cart'}
            icon={
              hasBackFace ? (
                <ArrowIcon direction={'right'} />
              ) : requesting ? (
                <Spinner height={'1.5rem'} />
              ) : (
                <PlusIcon />
              )
            }
            disabled={!hasBackFace && requesting}
            onClick={() => (hasBackFace ? flipCard() : addToCart())}
          />
        </footer>
      </section>
    </Fragment>
  );

  const backFace = (
    <Fragment>
      <header className='food-back-header'>
        <Button icon={<ArrowIcon />} onClick={flipCard} />
      </header>
      <section className='food-back-content'>
        {Array.isArray(availableCustomisations) &&
          availableCustomisations.length > 0 && (
            <section className='food-back-customisations'>
              <h2 className='food-back-customisations-header'>
                Customisations
              </h2>
              {availableCustomisations
                .filter(customisation => customisation.availability)
                .map(customisation => (
                  <div
                    key={customisation._id}
                    className='food-back-customisation'
                  >
                    {typeof customisation.max === 'number' &&
                    customisation.max === 1 ? (
                      <RadioInput
                        label={customisation.title}
                        required={!customisation.optional}
                        name={customisation._id}
                        inputs={customisation.options
                          .filter(option => option.availability)
                          .map(option => ({
                            key: (
                              <div className='food-back-option'>
                                <span className={'food-back-option-name'}>
                                  {option.name}
                                </span>
                                <span className={'food-back-option-price'}>
                                  {parseFloat(option.price) >= 0 ? '+' : '-'}{' '}
                                  {Math.abs(option.price).toFixed(2)}
                                </span>
                              </div>
                            ),
                            value: `${option._id},${option.price}`,
                          }))}
                        value={customisations[customisation._id]}
                        onChangeHandler={onCustomisationChange}
                        error={inputErrorMessages[customisation._id]}
                      />
                    ) : (
                      <CheckboxInput
                        label={customisation.title}
                        required={!customisation.optional}
                        name={customisation._id}
                        inputs={customisation.options
                          .filter(option => option.availability)
                          .map(option => ({
                            key: (
                              <div className='food-back-option'>
                                <span className={'food-back-option-name'}>
                                  {option.name}
                                </span>
                                <span className={'food-back-option-price'}>
                                  {parseFloat(option.price) >= 0 ? '+' : '-'}{' '}
                                  {Math.abs(option.price).toFixed(2)}
                                </span>
                              </div>
                            ),
                            value: `${option._id},${option.price}`,
                          }))}
                        value={customisations[customisation._id]}
                        onChangeHandler={onCustomisationChange}
                        max={customisation.max}
                        error={inputErrorMessages[customisation._id]}
                      />
                    )}
                  </div>
                ))}
            </section>
          )}
        {allowAdditionalInstruction && (
          <TextInput
            label={'Additional Instructions'}
            name={'additionalInstruction'}
            type={'text'}
            value={additionalInstruction}
            onChangeHandler={onChange}
          />
        )}
      </section>
      <footer className='food-back-footer'>
        {updateQtyGroup}
        <Button
          classes={'food-bottom-btn'}
          fill={'contained'}
          type={'primary'}
          block={true}
          blockBtnBottom={true}
          additionalContentClasses={'food-price'}
          additionalContent={`$${(
            (foodPrice + additionalPrice) *
            foodQty
          ).toFixed(2)}`}
          text={'cart'}
          icon={requesting ? <Spinner height={'1.5rem'} /> : <PlusIcon />}
          disabled={requesting}
          onClick={addToCart}
        />
      </footer>
    </Fragment>
  );

  return (
    <Flippable
      ref={flippableRef}
      wrapper={false}
      frontClass={'food-front'}
      frontContent={frontFace}
      backClass={'food-back'}
      backContent={backFace}
    />
  );
};

Food.propTypes = {
  food: PropTypes.object.isRequired,
  edit: PropTypes.object,
  unmountHandler: PropTypes.func,
  setSnackbar: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  addOrder: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  customer: state.customer,
});

const mapDispatchToProps = {
  setSnackbar,
  addOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Food);
