import React, { useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import Dialog from '../layout/Dialog';
import Button from '../layout/Button';
import CheckboxInput from '../layout/CheckboxInput';

// Icons
import CloseIcon from '../icons/CloseIcon';
import ArrowIcon from '../icons/ArrowIcon';
import PlusIcon from '../icons/PlusIcon';
import MinusIcon from '../icons/MinusIcon';

// Misc
import { v4 as uuid } from 'uuid';

const FoodDialog = ({ food, screenOrientation, closeFoodDialogHandler }) => {
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
    customisations,
  } = food;

  const dialogRef = useRef(null);

  const foodPrice = promotionPrice ? promotionPrice : price;

  // these must be destructured from food
  // new fields to be added
  let additionalInstructions = true;
  let minQty = 1;
  let maxQty = 5;

  const [flipCard, setFlipCard] = useState(false);

  const hasBackFace =
    (Array.isArray(customisations) && customisations.length > 0) ||
    additionalInstructions;

  const [foodQty, setFoodQty] = useState(minQty);

  const updateFoodQty = increment =>
    increment ? setFoodQty(foodQty + 1) : setFoodQty(foodQty - 1);

  const updateQtyGroup = (
    <section className='fooddialog-quantity-group'>
      <Button
        additionalClasses={'fooddialog-quantity-btn'}
        btnStyle={'contained'}
        type={'primary'}
        icon={<MinusIcon />}
        onClick={() => updateFoodQty(false)}
        disabled={foodQty === minQty}
      />
      <div className='fooddialog-quantity'>{foodQty}</div>
      <Button
        additionalClasses={'fooddialog-quantity-btn'}
        btnStyle={'contained'}
        type={'primary'}
        icon={<PlusIcon />}
        onClick={() => updateFoodQty(true)}
        disabled={foodQty === maxQty}
      />
    </section>
  );

  const [customisationsFormValue, setCustomisationsFormValue] = useState(
    customisations.reduce((result, item) => {
      result[item._id] = [];
      return result;
    }, {})
  );

  const [additionalPrice, setAdditionalPrice] = useState(0);

  const onCustomisationChange = ({ name, value }) => {
    let newCustomisationsFormValue = {
      ...customisationsFormValue,
      [name]: value,
    };

    setCustomisationsFormValue(newCustomisationsFormValue);

    let newAdditionalPrice = 0;
    let customisationsFormValueArr = Object.values(newCustomisationsFormValue);

    customisationsFormValueArr.forEach(customisationValue => {
      customisationValue.forEach(selectedOption => {
        const [, optionPrice] = selectedOption.split(',');
        newAdditionalPrice += parseFloat(optionPrice);
      });
    });

    setAdditionalPrice(newAdditionalPrice);
  };

  const addToCart = async () => {
    // console.log(customisationsFormValue);
    // dialogRef.current.animatedCloseDialog();
    // console.log(dialogRef.current.animatedCloseDialog());
  };

  const closeDialog = () => {
    const dialog = dialogRef.current;

    if (dialog) {
      dialog.animateClose();
    }
  };

  const content = (
    <Fragment>
      <section
        className={`fooddialog-front ${flipCard ? 'hidden' : ''}`.trim()}
      >
        <section className='fooddialog-front-image'>
          <img src={image} alt={`${name}-foodimage-${foodId}`} />
          <Button
            additionalClasses={'fooddialog-close-btn'}
            icon={<CloseIcon />}
            onClick={closeDialog}
          />
        </section>
        <section className='fooddialog-front-content'>
          <section className='fooddialog-front-header'>
            <h1 className='fooddialog-front-name'>{name}</h1>
            {typeof portionSize === 'number' && (
              <p className='fooddialog-front-portionsize'>For {portionSize}</p>
            )}
          </section>
          <section className='fooddialog-front-body'>
            {desc && (
              <section className='fooddialog-front-desc'>{desc}</section>
            )}
            {Array.isArray(allergics) && allergics.length > 0 && (
              <section className='fooddialog-front-allergics'>
                {allergics.map(allergy => (
                  <span key={uuid()} className='chip'>
                    {allergy}
                  </span>
                ))}
              </section>
            )}
            {preparationTime && (
              <section className='fooddialog-front-preparationtime'>
                {preparationTime}
              </section>
            )}
          </section>
          <section className='fooddialog-front-footer'>
            {!hasBackFace && updateQtyGroup}
            <Button
              btnStyle={'contained'}
              type={'primary'}
              block={true}
              fixBlockBtnBottom={true}
              additionalText={`$${(
                (foodPrice + additionalPrice) *
                foodQty
              ).toFixed(2)}`}
              text={hasBackFace ? 'More' : 'Cart'}
              icon={
                hasBackFace ? <ArrowIcon direction={'right'} /> : <PlusIcon />
              }
              additionalClasses={'fooddialog-bottom-btn'}
              onClick={() => (hasBackFace ? setFlipCard(true) : addToCart())}
            />
          </section>
        </section>
      </section>
      {hasBackFace && (
        <section
          className={`fooddialog-back ${flipCard ? 'shown' : ''}`.trim()}
        >
          <section className='fooddialog-back-header'>
            <Button icon={<ArrowIcon />} onClick={() => setFlipCard(false)} />
          </section>
          <section className='fooddialog-back-body'>
            {Array.isArray(customisations) && customisations.length > 0 && (
              <section className='fooddialog-back-customisations-group'>
                <h2 className='fooddialog-back-customisations-group-title'>
                  Customisations
                </h2>
                {customisations.map(customisation => (
                  <div
                    key={customisation._id}
                    className='fooddialog-back-customisation'
                  >
                    <CheckboxInput
                      label={customisation.title}
                      name={customisation._id}
                      checkboxInputs={customisation.options
                        .filter(option => option.availability)
                        .map(option => ({
                          key: (
                            <Fragment>
                              <span>{option.name}</span>
                              <span
                                className={
                                  'fooddialog-back-customisation-option-price'
                                }
                              >
                                {parseFloat(option.price) >= 0 ? '+' : '-'}{' '}
                                {Math.abs(option.price).toFixed(2)}
                              </span>
                            </Fragment>
                          ),
                          value: `${option._id},${option.price}`,
                        }))}
                      value={customisationsFormValue[customisation._id]}
                      onChangeHandler={onCustomisationChange}
                      max={customisation.max ? customisation.max : null}
                    />
                  </div>
                ))}
              </section>
            )}
          </section>
          <section className='fooddialog-back-footer'>
            {updateQtyGroup}
            <Button
              btnStyle={'contained'}
              type={'primary'}
              block={true}
              fixBlockBtnBottom={true}
              additionalText={`$${(
                (foodPrice + additionalPrice) *
                foodQty
              ).toFixed(2)}`}
              text={'Cart'}
              icon={<PlusIcon />}
              additionalClasses={'fooddialog-bottom-btn'}
              onClick={addToCart}
            />
          </section>
        </section>
      )}
    </Fragment>
  );

  return (
    <Dialog
      ref={dialogRef}
      structure={false}
      additionalClasses={'fooddialog-wrapper'}
      content={content}
      fullscreen={screenOrientation}
      unmountDialogHandler={closeFoodDialogHandler}
    />
  );
};

FoodDialog.propTypes = {
  food: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FoodDialog);
