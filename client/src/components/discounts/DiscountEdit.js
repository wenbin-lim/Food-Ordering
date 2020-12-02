import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';
import DatePicker from '../layout/DatePicker';
import RadioInput from '../layout/RadioInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetOne from '../../query/hooks/useGetOne';
import usePut from '../../query/hooks/usePut';

const DiscountEdit = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: discount, isLoading, error } = useGetOne('discount', id, {
    route: `/api/discounts/${id}`,
  });
  useErrors(error);

  const [
    editDiscount,
    { isLoading: requesting, error: editErrors },
  ] = usePut('discounts', { route: `/api/discounts/${id}` });
  const [inputErrors] = useErrors(editErrors, ['code', 'value']);

  const [formData, setFormData] = useState({
    code: '',
    expiry: new Date(new Date().setHours(0, 0, 0, 0)),
    minSpending: '0',
    type: 'cash',
    value: '0',
    cap: '',
  });

  const { code, expiry, minSpending, type, value, cap } = formData;

  useEffect(() => {
    if (discount) {
      const { code, expiry, minSpending, type, value, cap } = discount;
      setFormData({
        code: code ? code : '',
        expiry: expiry
          ? new Date(expiry)
          : new Date(new Date().setHours(0, 0, 0, 0)),
        minSpending:
          typeof minSpending === 'number' ? minSpending.toString() : '0',
        type: type ? type : 'cash',
        value: typeof value === 'number' ? value.toString() : '0',
        cap: typeof cap === 'number' ? cap.toString() : '',
      });
    }
  }, [isLoading, discount]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const editDiscountSuccess = await editDiscount(formData);

    return (
      editDiscountSuccess &&
      dispatch(setSnackbar(`Edited discount of code '${code}'`, 'success'))
    );
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title='Edit Discount'
        closeHandler={() => navigate('../')}
      />
      <SideSheet.Content
        elementType='form'
        id='discountEditForm'
        onSubmit={onSubmit}
      >
        <TextInput
          label='Code'
          required={true}
          name='code'
          type='text'
          value={code}
          onChangeHandler={onChange}
          error={inputErrors.code}
          informationText='Unique code with at least 4 characters without spacing'
        />

        <DatePicker
          label='Expiry Date'
          name='expiry'
          min={new Date()}
          max={new Date(2040, 0, 1)}
          value={expiry}
          onChangeHandler={onChange}
          informationText='Discount will expire on 12am of above date'
        />

        <RadioInput
          label='Discount Type'
          required={true}
          name='type'
          inputs={['cash', 'percentage'].map(type => ({
            key: type.toUpperCase(),
            value: type,
          }))}
          value={type}
          onChangeHandler={onChange}
          inline={true}
        />

        <TextInput
          label={`Price discount value in ${type === 'cash' ? '($)' : '(%)'}`}
          name='value'
          type='number'
          value={value}
          onChangeHandler={onChange}
          error={inputErrors.value}
        />

        <TextInput
          label='Min Spending for Discount'
          name='minSpending'
          type='number'
          value={minSpending}
          onChangeHandler={onChange}
          error={inputErrors.minSpending}
        />

        {type === 'percentage' && (
          <TextInput
            label='Cap for percentage based discount'
            name='cap'
            type='number'
            value={cap}
            onChangeHandler={onChange}
            error={inputErrors.cap}
            informationText='In SGD$'
          />
        )}
      </SideSheet.Content>
      <SideSheet.FooterButton
        text='edit'
        requesting={requesting}
        form='discountEditForm'
      />
    </SideSheet>
  );
};

export default DiscountEdit;
