import React, { useRef } from 'react';
import PropTypes from 'prop-types';

// Components
import Dialog from './Dialog';
import Button from './Button';
import Spinner from './Spinner';

// Icons
import ArrowIcon from '../icons/ArrowIcon';

// Misc
import { v4 as uuid } from 'uuid';

const FormDialog = ({
  elementType = 'form',
  title,
  onSubmit,
  onCloseFormDialog,
  submitRequesting,
  style,
  children,
}) => {
  const formDialogRef = useRef(null);
  const formId = uuid();

  const onFormSubmit = async e => {
    e.preventDefault();

    if (typeof onSubmit === 'function') {
      const onSubmitSuccess = await onSubmit(e);

      if (onSubmitSuccess) {
        formDialogRef.current?.closeDialog();
      }
    }
  };

  return (
    <Dialog
      ref={formDialogRef}
      dialogElementType={elementType}
      id={formId}
      className='dialog-form'
      onCloseDialog={onCloseFormDialog}
      style={style}
    >
      {title && <h2 className='dialog-form-title'>{title}</h2>}
      <section className='dialog-form-content'>{children}</section>
      <Button
        className='dialog-form-submit-btn'
        fill='contained'
        type='primary'
        text='Submit'
        icon={
          submitRequesting ? (
            <Spinner height='1.5rem' />
          ) : (
            <ArrowIcon direction='right' />
          )
        }
        block={true}
        blockBtnBottom={true}
        disabled={submitRequesting}
        onClick={onFormSubmit}
      />
    </Dialog>
  );
};

FormDialog.propTypes = {
  elementType: PropTypes.string,
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  onCloseFormDialog: PropTypes.func,
};

export default FormDialog;
