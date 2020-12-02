import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// Actions
import { setSnackbar } from '../../actions/app';

// Components
import Dialog from '../layout/Dialog';
import Dropdown from '../layout/Dropdown';
import TextInput from '../layout/TextInput';
import Button from '../layout/Button';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Custom Hooks
import useErrors from '../../hooks/useErrors';
import usePost from '../../query/hooks/usePost';

const AssistanceReasonsDialog = ({
  assistanceReasons,
  tableName,
  onCloseAssistanceReasonsDialog,
}) => {
  const dispatch = useDispatch();
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    assistanceReason:
      Array.isArray(assistanceReasons) && assistanceReasons.length > 0
        ? assistanceReasons[0]
        : '',
    remarks: '',
  });

  const { assistanceReason, remarks } = formData;

  const onChange = ({ name, value }) =>
    setFormData({ ...formData, [name]: value });

  const [sendNotification, { error: addError }] = usePost('notifications', {
    route: `/api/notifications`,
  });
  useErrors(addError);

  const sendAssistanceNotification = async () => {
    // send notification
    const sendNotificationSuccess = await sendNotification({
      type: 'customerHelp',
      forWho: ['waiter', 'admin'],
      tableName,
      assistanceReason,
      remarks,
    });

    // dispatch snackbar
    if (sendNotificationSuccess && dialogRef.current) {
      dispatch(setSnackbar('Please wait for assistance', 'success'));
      dialogRef.current.closeDialog();
    }
  };

  return (
    <Dialog
      ref={dialogRef}
      className='dialog-assistance-reason'
      onCloseDialog={onCloseAssistanceReasonsDialog}
    >
      <h2 className='dialog-assistance-reason-title'>Assistance</h2>

      <section className='dialog-assistance-reason-content'>
        {Array.isArray(assistanceReasons) && assistanceReasons.length > 0 && (
          <Dropdown
            name='assistanceReason'
            options={assistanceReasons.map(reason => ({
              key: reason,
              value: reason,
            }))}
            value={assistanceReason}
            onChangeHandler={onChange}
            size={3}
          />
        )}

        <TextInput
          label='Remarks'
          type='text'
          name='remarks'
          value={remarks}
          onChangeHandler={onChange}
        />
      </section>

      <Button
        className='dialog-assistance-reason-footer-btn'
        fill='contained'
        type='primary'
        block={true}
        blockBtnBottom={true}
        text='submit'
        icon={<ArrowIcon direction='right' />}
        onClick={sendAssistanceNotification}
      />
    </Dialog>
  );
};

AssistanceReasonsDialog.propTypes = {
  assistanceReasons: PropTypes.array,
  tableName: PropTypes.string,
  onCloseAssistanceReasonsDialog: PropTypes.func,
};

export default AssistanceReasonsDialog;
