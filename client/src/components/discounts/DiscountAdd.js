import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';
import Dropdown from '../layout/Dropdown';
import DatePicker from '../layout/DatePicker';
import RadioInput from '../layout/RadioInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGet from '../../query/hooks/useGet';
import usePost from '../../query/hooks/usePost';

const DiscountAdd = ({
  user: { access: userAccess },
  company: userCompanyId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: companies, error: companiesError } = useGet('companies', {
    route: '/api/companies',
    enabled: userAccess === 99,
  });
  useErrors(companiesError);

  const [addDiscount, { isLoading: requesting, error }] = usePost('discounts', {
    route: '/api/discounts',
  });
  const [inputErrors] = useErrors(error, [
    'code',
    'value',
    'minSpending',
    'cap',
  ]);

  const [formData, setFormData] = useState({
    company: userCompanyId,
    code: '',
    expiry: new Date(new Date().setHours(0, 0, 0, 0)),
    minSpending: '0',
    type: 'cash',
    value: '0',
    cap: '',
  });

  const { company, code, expiry, minSpending, type, value, cap } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const addDiscountSuccess = await addDiscount(formData);

    return (
      addDiscountSuccess &&
      dispatch(setSnackbar(`Added discount of code '${code}'`, 'success'))
    );
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title='Add Discount'
        closeHandler={() => navigate('../')}
      />
      <SideSheet.Content
        elementType='form'
        id='discountAddForm'
        onSubmit={onSubmit}
      >
        {userAccess === 99 && Array.isArray(companies) && (
          <Dropdown
            required={true}
            label='Company'
            name='company'
            options={companies.map(({ _id, displayedName }) => ({
              key: displayedName,
              value: _id,
            }))}
            value={company}
            onChangeHandler={onChange}
          />
        )}

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
        text='add'
        requesting={requesting}
        form='discountAddForm'
      />
    </SideSheet>
  );
};

DiscountAdd.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default DiscountAdd;
