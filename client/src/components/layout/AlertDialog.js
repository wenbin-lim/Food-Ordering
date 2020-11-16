import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Components
import Dialog from './Dialog';
import Button from './Button';

const AlertDialog = ({ title, text, action, onCloseAlertDialog }) => {
  const navigate = useNavigate();
  const alertDialogRef = useRef(null);

  const { name, type, callback, path } = { ...action };

  const closeAlertDialog = confirm => {
    const alertDialog = alertDialogRef.current;

    if (alertDialog) {
      const alertDialogTlm = alertDialog.tlm;

      if (confirm) {
        alertDialogTlm.eventCallback('onReverseComplete', () => {
          onCloseAlertDialog();
          if (typeof callback === 'function') {
            callback();
          } else if (typeof path === 'string') {
            navigate(path);
          }
        });
        alertDialogTlm.reverse();
      } else {
        alertDialog.closeDialog();
      }
    }
  };

  return (
    <Dialog
      ref={alertDialogRef}
      className={'dialog-alert'}
      onCloseDialog={onCloseAlertDialog}
    >
      <section className='dialog-alert-content'>
        {title && <h2 className='dialog-alert-content-title'>{title}</h2>}
        {text && <p className='dialog-alert-content-text'>{text}</p>}
      </section>
      <footer className='dialog-alert-btn-group'>
        <Button
          className={'dialog-alert-btn-confirm'}
          fill={'contained'}
          type={type}
          text={name}
          small={true}
          onClick={() => closeAlertDialog(true)}
        />
        <Button
          className={'dialog-alert-btn-cancel'}
          fill={'outline'}
          type={'background'}
          text={'Cancel'}
          small={true}
          onClick={() => closeAlertDialog(false)}
        />
      </footer>
    </Dialog>
  );
};

AlertDialog.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  action: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'primary',
      'secondary',
      'error',
      'success',
      'warning',
      'background',
    ]).isRequired,
    callback: PropTypes.func,
    path: PropTypes.string,
  }).isRequired,
  onCloseAlertDialog: PropTypes.func.isRequired,
};

export default AlertDialog;
