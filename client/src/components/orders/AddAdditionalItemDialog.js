import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import FormDialog from '../layout/FormDialog';
import TextInput from '../layout/TextInput';

// Hooks
import usePost from '../../query/hooks/usePost';
import usePut from '../../query/hooks/usePut';
import useErrors from '../../hooks/useErrors';

const AddAdditionalItemDialog = ({
  billId,
  additionalItem,
  onCloseAddAdditionalItemDialog,
}) => {
  const [
    addAdditionalItem,
    { isLoading: addRequesting, error: addErrors },
  ] = usePost('orders', {
    route: '/api/orders',
  });
  const [
    editAdditionalItem,
    { isLoading: editRequesting, error: editErrors },
  ] = usePut('orders', {
    route: `/api/orders/${additionalItem?._id}`,
  });
  const [inputErrors] = useErrors(additionalItem ? editErrors : addErrors, [
    'additionalItemName',
    'price',
  ]);

  const [formData, setFormData] = useState({
    additionalItemName: '',
    price: '',
  });

  const { additionalItemName, price } = formData;

  useEffect(() => {
    if (additionalItem) {
      const { additionalItemName, price } = additionalItem;

      setFormData({
        additionalItemName: additionalItemName ? additionalItemName : '',
        price: typeof price === 'number' ? price.toString() : '',
      });
    }

    // eslint-disable-next-line
  }, [additionalItem]);

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const onSubmit = async e => {
    e.preventDefault();

    if (additionalItem) {
      return await editAdditionalItem({
        ...additionalItem,
        ...formData,
        currentStatus: 'updated',
        bill: additionalItem.bill._id,
      });
    } else {
      return await addAdditionalItem({
        ...formData,
        isAdditionalItem: true,
        bill: billId,
      });
    }
  };

  return (
    <FormDialog
      elementType='article'
      title='Additional Item'
      onSubmit={onSubmit}
      submitRequesting={additionalItem ? editRequesting : addRequesting}
      onCloseFormDialog={onCloseAddAdditionalItemDialog}
    >
      <TextInput
        label='name'
        name='additionalItemName'
        type='text'
        value={additionalItemName}
        onChangeHandler={onChange}
        error={inputErrors.additionalItemName}
      />

      <TextInput
        label='price'
        name='price'
        type='number'
        value={price}
        onChangeHandler={onChange}
        error={inputErrors.price}
      />
    </FormDialog>
  );
};

AddAdditionalItemDialog.propTypes = {
  billId: PropTypes.string,
  onCloseAddAdditionalItemDialog: PropTypes.func,
};

export default AddAdditionalItemDialog;
