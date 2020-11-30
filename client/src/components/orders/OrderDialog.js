import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import Dialog from '../layout/Dialog';
import Flippable from '../layout/Flippable';
import Button from '../layout/Button';
import SideSheet from '../layout/SideSheet';
import RadioInput from '../layout/RadioInput';
import CheckboxInput from '../layout/CheckboxInput';
import TextInput from '../layout/TextInput';
import Spinner from '../layout/Spinner';
import FormDialog from '../layout/FormDialog';
import Dropdown from '../layout/Dropdown';

// Icons
import ImageIcon from '../icons/ImageIcon';
import CloseIcon from '../icons/CloseIcon';
import PlusIcon from '../icons/PlusIcon';
import MinusIcon from '../icons/MinusIcon';
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGet from '../../query/hooks/useGet';
import usePost from '../../query/hooks/usePost';
import usePut from '../../query/hooks/usePut';

const OrderQuantity = ({ min, max, quantity, onClickMinus, onClickPlus }) => {
  return (
    <section className='food-quantity-group'>
      <Button
        className={'food-quantity-btn'}
        fill={'contained'}
        type={'primary'}
        icon={<MinusIcon />}
        onClick={onClickMinus}
        disabled={quantity === min}
      />
      <div className='food-quantity'>{quantity}</div>
      <Button
        className={'food-quantity-btn'}
        fill={'contained'}
        type={'primary'}
        icon={<PlusIcon />}
        onClick={onClickPlus}
        disabled={quantity === max}
      />
    </section>
  );
};

OrderQuantity.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  quantity: PropTypes.number,
  onClickMinus: PropTypes.func,
  onClickPlus: PropTypes.func,
};

const CustomisationInput = ({
  customisation,
  value,
  onChangeHandler,
  error,
}) => {
  const { _id: customisationId, title, optional, max, options } = customisation;

  const availableOptions = Array.isArray(options)
    ? options.filter(option => option.availability)
    : [];

  const validCustomisation =
    availableOptions.length > 0 && typeof max === 'number';

  const inputs = validCustomisation
    ? availableOptions.map(({ _id: optionId, name, price }) => ({
        key: (
          <div className='customisation-group-option-key'>
            <span className='customisation-group-option-name'>{name}</span>
            <span className='customisation-group-option-price'>
              {parseFloat(price) >= 0 ? '+' : '-'} {Math.abs(price).toFixed(2)}
            </span>
          </div>
        ),
        value: optionId,
      }))
    : [];

  const onRadioInputChange = ({ name, value }) =>
    onChangeHandler({ name, value: [value] });

  return validCustomisation ? (
    max === 1 ? (
      <RadioInput
        label={title}
        required={!optional}
        name={customisationId}
        inputs={inputs}
        value={value[0]}
        onChangeHandler={onRadioInputChange}
        error={error}
      />
    ) : (
      <CheckboxInput
        label={title}
        required={!optional}
        name={customisationId}
        inputs={inputs}
        value={value}
        onChangeHandler={onChangeHandler}
        max={max}
        error={error}
      />
    )
  ) : null;
};

const OrderDialog = ({
  foodDetails,
  order,
  addToWhichBillId,
  onCloseOrderDialog,
  screenOrientation,
  auth: { user },
}) => {
  const dispatch = useDispatch();

  const dialogRef = useRef(null);
  const closeDialog = () => dialogRef.current?.closeDialog();

  const flippableRef = useRef(null);
  const flipCard = () => flippableRef.current?.flip();

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
    tags,
    customisations: allAvailableCustomisations,
    minQty,
    maxQty,
    allowAdditionalInstruction,
  } = foodDetails;

  const availableCustomisations =
    Array.isArray(allAvailableCustomisations) &&
    allAvailableCustomisations.filter(
      customisation => customisation.availability
    );

  const hasBackFace =
    availableCustomisations.length > 0 || allowAdditionalInstruction;

  const singleOrderPrice = promotionPrice ? promotionPrice : price;

  const [quantity, setQuantity] = useState(minQty);
  const [totalPrice, setTotalPrice] = useState(singleOrderPrice);
  const [additionalInstruction, setAdditionalInstruction] = useState('');
  const [customisationsUsed, setCustomisationsUsed] = useState(() => {
    let initial = {};

    availableCustomisations.forEach(({ _id }) => {
      initial[_id] = [];
    });

    return initial;
  });

  const [
    addOrder,
    { isLoading: addRequesting, error: addErrors },
  ] = usePost('orders', { route: '/api/orders' });

  const [
    editOrder,
    { isLoading: editRequesting, error: editErrors },
  ] = usePut('orders', { route: `/api/orders/${order?._id}` });

  const [inputErrors] = useErrors(
    order ? editErrors : addErrors,
    availableCustomisations.map(customisation => customisation._id)
  );

  useEffect(() => {
    if (order) {
      const {
        quantity,
        customisationsUsed: initialCustomisationsUsed,
        additionalInstruction,
      } = order;

      let newCustomisationsUsed = customisationsUsed;

      initialCustomisationsUsed.forEach(initialCustomisationUsed => {
        const { customisation, optionsSelected } = initialCustomisationUsed;
        const { _id: customisationId } = { ...customisation };

        newCustomisationsUsed[customisationId] = optionsSelected.map(
          option => option._id
        );
      });

      setQuantity(quantity);
      setAdditionalInstruction(additionalInstruction);
      setCustomisationsUsed(newCustomisationsUsed);
    }

    // eslint-disable-next-line
  }, [order]);

  const onCustomisationGroupChange = ({ name, value }) => {
    setCustomisationsUsed({ ...customisationsUsed, [name]: value });
  };

  useEffect(() => {
    // additional price from customisations used
    let additionalPrice = 0;

    let customisationUsedArr = Object.entries(customisationsUsed);
    customisationUsedArr.forEach(customisationUsed => {
      const [customisationUsedId, optionsSelected] = customisationUsed;
      const foundCustomisation = availableCustomisations.find(
        customisation => customisation._id === customisationUsedId
      );

      const { options: foundOptions } = foundCustomisation;

      if (Array.isArray(optionsSelected)) {
        optionsSelected.forEach(optionSelected => {
          let foundOption = foundOptions.find(
            option => option._id === optionSelected
          );

          if (foundOption) {
            additionalPrice += parseFloat(foundOption.price);
          }
        });
      }
    });

    setTotalPrice((singleOrderPrice + additionalPrice) * quantity);

    // eslint-disable-next-line
  }, [quantity, customisationsUsed]);

  const sanitizeCustomisationsUsed = customisationsUsed =>
    Object.entries(customisationsUsed).map(
      ([customisationId, optionSelectedIds]) => {
        const customisation = availableCustomisations.find(
          customisation => customisation._id === customisationId
        );

        const { options: availableOptions } = { ...customisation };
        const optionsSelected = optionSelectedIds.map(optionId =>
          availableOptions.find(option => option._id === optionId)
        );

        return {
          customisation,
          optionsSelected,
        };
      }
    );

  const addToCart = async () => {
    const { access } = user;

    if (order) {
      const editOrderSuccess = await editOrder({
        food: foodId,
        quantity,
        customisationsUsed: sanitizeCustomisationsUsed(customisationsUsed),
        additionalInstruction,
        price: totalPrice.toFixed(2),
        currentStatus: access > 1 ? 'updated' : undefined,
        bill: access > 1 ? order.bill._id : undefined,
      });

      if (editOrderSuccess) {
        dispatch(setSnackbar('Order edited!', 'success'));
        closeDialog();
      }
    } else {
      const addOrderSuccess = await addOrder({
        food: foodId,
        isAdditionalItem: false,
        quantity,
        customisationsUsed: sanitizeCustomisationsUsed(customisationsUsed),
        additionalInstruction,
        price: totalPrice.toFixed(2),
        bill: access > 1 ? addToWhichBillId : undefined,
      });

      if (addOrderSuccess) {
        dispatch(setSnackbar('Order added!', 'success'));
        closeDialog();
      }
    }
  };

  return (
    <Dialog
      ref={dialogRef}
      className={'flippable-wrapper orderdialog'}
      fullscreen={screenOrientation}
      onCloseDialog={onCloseOrderDialog}
    >
      <Flippable ref={flippableRef} wrapper={false}>
        <Flippable.Front className='orderdialog-front'>
          <section
            className='orderdialog-front-image'
            style={{
              backgroundImage: image ? `url(${image})` : null,
            }}
          >
            {!image && <ImageIcon width={128} />}
            <Button
              className={'orderdialog-close-btn'}
              icon={<CloseIcon />}
              onClick={closeDialog}
            />
          </section>

          <section className='orderdialog-front-content'>
            <h1 className='orderdialog-front-name'>
              {name ? name : 'No name defined'}
            </h1>
            <p className='orderdialog-front-portionsize'>
              {portionSize ? `For ${portionSize}` : ''}
            </p>
            <p className='orderdialog-front-desc'>{desc}</p>
            <p className='orderdialog-front-preparationtime'>
              {preparationTime}
            </p>
            <section className='orderdialog-front-allergics'>
              {allergics.map((allergy, index) => (
                <span key={`${allergy}-${index}`} className='chip'>
                  {allergy}
                </span>
              ))}
            </section>

            <section className='orderdialog-front-tags'>
              {tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className='orderdialog-front-tag'>
                  #{tag}
                </span>
              ))}
            </section>
          </section>

          <section className='orderdialog-front-footer'>
            {!hasBackFace && (
              <OrderQuantity
                min={minQty}
                max={maxQty}
                quantity={quantity}
                onClickMinus={() => setQuantity(quantity - 1)}
                onClickPlus={() => setQuantity(quantity + 1)}
              />
            )}

            {!hasBackFace && user.access > 1 && !order && !addToWhichBillId ? (
              <div className='primary pt-1 pb-2'>
                <p className='caption text-center'>Min Quantity: {minQty}</p>
                <p className='caption text-center'>Max Quantity: {maxQty}</p>
                <h3 className='heading-3 text-center mt-1'>
                  Price: ${totalPrice.toFixed(2)}
                </h3>
              </div>
            ) : (
              <Button
                fill='contained'
                type='primary'
                block={true}
                blockBtnBottom={true}
                text={hasBackFace ? 'More' : order ? 'Edit' : 'Add'}
                icon={
                  order ? (
                    editRequesting ? (
                      <Spinner height='1.5rem' />
                    ) : (
                      <ArrowIcon direction='right' />
                    )
                  ) : addRequesting ? (
                    <Spinner height='1.5rem' />
                  ) : (
                    <ArrowIcon direction='right' />
                  )
                }
                disabled={order ? editRequesting : addRequesting}
                onClick={() => (hasBackFace ? flipCard() : addToCart())}
              />
            )}
          </section>
        </Flippable.Front>
        <Flippable.Back className='orderdialog-back sidesheet'>
          <SideSheet wrapper={false}>
            <SideSheet.Header closeHandler={flipCard} icon={<ArrowIcon />} />
            <SideSheet.Content className='orderdialog-back-content'>
              {availableCustomisations.length > 0 &&
                availableCustomisations.map(customisation => (
                  <CustomisationInput
                    key={customisation._id}
                    customisation={customisation}
                    value={customisationsUsed[customisation._id]}
                    onChangeHandler={onCustomisationGroupChange}
                    error={inputErrors[customisation._id]}
                  />
                ))}
              {allowAdditionalInstruction &&
                user.access > 1 &&
                (order || addToWhichBillId) && (
                  <TextInput
                    label='Additional Instructions'
                    name='additionalInstruction'
                    type='text'
                    value={additionalInstruction}
                    onChangeHandler={({ value }) =>
                      setAdditionalInstruction(value)
                    }
                  />
                )}
            </SideSheet.Content>
            <SideSheet.Footer>
              <OrderQuantity
                min={minQty}
                max={maxQty}
                quantity={quantity}
                onClickMinus={() => setQuantity(quantity - 1)}
                onClickPlus={() => setQuantity(quantity + 1)}
              />

              {user.access > 1 && !order && !addToWhichBillId ? (
                <div className='primary pt-1 pb-2'>
                  <p className='caption text-center'>Min Quantity: {minQty}</p>
                  <p className='caption text-center'>Max Quantity: {maxQty}</p>
                  <h3 className='heading-3 text-center mt-1'>
                    Price: ${totalPrice.toFixed(2)}
                  </h3>
                </div>
              ) : (
                <Button
                  fill='contained'
                  type='primary'
                  block={true}
                  blockBtnBottom={true}
                  additionalContentClassName='orderdialog-totalprice'
                  additionalContent={`$${totalPrice.toFixed(2)}`}
                  text={order ? 'Edit' : 'Add'}
                  icon={
                    order ? (
                      editRequesting ? (
                        <Spinner height='1.5rem' />
                      ) : (
                        <ArrowIcon direction='right' />
                      )
                    ) : addRequesting ? (
                      <Spinner height='1.5rem' />
                    ) : (
                      <ArrowIcon direction='right' />
                    )
                  }
                  disabled={order ? editRequesting : addRequesting}
                  onClick={addToCart}
                />
              )}
            </SideSheet.Footer>
          </SideSheet>
        </Flippable.Back>
      </Flippable>
    </Dialog>
  );
};

OrderDialog.propTypes = {
  foodDetails: PropTypes.object,
  order: PropTypes.object,
  addToWhichBillId: PropTypes.string,
  onCloseOrderDialog: PropTypes.func,
  screenOrientation: PropTypes.bool,
  auth: PropTypes.object,
};

const mapStateToProps = state => ({
  screenOrientation: state.app.screenOrientation,
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDialog);
