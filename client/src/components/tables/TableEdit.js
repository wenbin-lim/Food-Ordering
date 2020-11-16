import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import SideSheet from '../layout/SideSheet';
import TextInput from '../layout/TextInput';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import useGetOne from '../../query/hooks/useGetOne';
import useEditOne from '../../query/hooks/useEditOne';

const TableEdit = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: table, isLoading, error } = useGetOne('table', id);
  useErrors(error);

  const [editTable, { isLoading: requesting, error: editErrors }] = useEditOne(
    'tables'
  );
  const [inputErrors] = useErrors(editErrors, ['name']);

  const [formData, setFormData] = useState({
    name: '',
  });

  const { name } = formData;

  useEffect(() => {
    if (table) {
      const { name } = table;

      setFormData({
        name: name ? name : '',
      });
    }
  }, [isLoading, table]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    const editTableSuccess = await editTable({ id, newItem: formData });

    return (
      editTableSuccess &&
      dispatch(setSnackbar(`Edited table of name '${name}'`, 'success'))
    );
  };

  const closeSideSheet = () => navigate('../../');

  return (
    <SideSheet wrapper={false}>
      <SideSheet.Header title={'Edit Table'} closeHandler={closeSideSheet} />
      <SideSheet.Content
        elementType={'form'}
        id={'tableEditForm'}
        onSubmit={onSubmit}
      >
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
        text={'edit'}
        requesting={requesting}
        form={'tableEditForm'}
      />
    </SideSheet>
  );
};

export default TableEdit;
