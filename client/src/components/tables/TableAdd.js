import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { queryCache } from 'react-query';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';
import Dropdown from '../layout/Dropdown';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useAddOne from '../../query/hooks/useAddOne';

const TableAdd = ({ user: { access: userAccess }, company: userCompanyId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const companies = queryCache.getQueryData('companies');

  const [addTable, { isLoading: requesting, error }] = useAddOne('tables');
  const [inputErrors] = useErrors(error, ['name']);

  const [formData, setFormData] = useState({
    company: userCompanyId,
    name: '',
  });

  const { company, name } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const addTableSuccess = await addTable(formData);

    return (
      addTableSuccess &&
      dispatch(setSnackbar(`Added table of name '${name}'`, 'success'))
    );
  };

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header
        title={'Add Table'}
        closeHandler={() => navigate('../')}
      />
      <SideSheet.Content
        elementType={'form'}
        id={'tableAddForm'}
        onSubmit={onSubmit}
      >
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

        <TextInput
          label={'name'}
          required={true}
          name={'name'}
          type={'text'}
          value={name}
          onChangeHandler={onChange}
          error={inputErrors.name}
        />
      </SideSheet.Content>
      <SideSheet.FooterButton
        text={'add'}
        requesting={requesting}
        form={'tableAddForm'}
      />
    </SideSheet>
  );
};

TableAdd.propTypes = {
  user: PropTypes.object,
  company: PropTypes.string,
};

export default TableAdd;
