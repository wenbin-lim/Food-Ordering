import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../actions/app';
import { logout } from '../actions/auth';

/* 
  // must return a function

  const snackbarActionSwitchFunc = actionName => {
    switch (actionName) {
      case 'refresh':
        return () => console.log('refresh');
      case 'somethingelse':
        return () => console.log('something else');
      default:
        return () => {};
    }
  };
*/
export default function useErrors(err, inputs = [], options = {}) {
  const { showSnackbarForInvalidFields, snackbarActionSwitchFunc } = options;
  const dispatch = useDispatch();

  let initialInputsErrors = inputs.reduce((result, inputName) => {
    result[inputName] = '';
    return result;
  }, {});

  const [inputsErrors, setInputsErrors] = useState(initialInputsErrors);

  useEffect(() => {
    let newInputErrors = initialInputsErrors;

    if (err) {
      const { response } = err;

      if (!response) {
        console.error(err);
      }

      const { status, data } = { ...response };

      switch (status) {
        case 400:
          let invalidFields = [];
          data.forEach(({ param, msg }) => {
            if (typeof newInputErrors[param] === 'undefined') {
              dispatch(setSnackbar(msg, 'error'));
              console.error(`Input field [${param}] is invalid`);
            } else {
              newInputErrors[param] = msg;
              invalidFields.push(param.toUpperCase());
            }
          });
          showSnackbarForInvalidFields &&
            invalidFields.length > 0 &&
            dispatch(
              setSnackbar(
                `Invalid values found for ${invalidFields.join(', ')}`,
                'error'
              )
            );
          break;
        case 401:
        case 403:
        case 404:
        case 406:
          if (status === 401 || status === 403) {
            dispatch(logout());
          }
          if (typeof data === 'string') {
            dispatch(setSnackbar(data, 'error'));
          } else if (typeof data === 'object') {
            // snackbar with action
            const { msg, actionName } = data;

            if (typeof snackbarActionSwitchFunc === 'function') {
              dispatch(
                setSnackbar(
                  msg,
                  'error',
                  {
                    name: 'refresh',
                    callback: snackbarActionSwitchFunc(actionName),
                  },
                  0
                )
              );
            } else {
              dispatch(setSnackbar(msg, 'error'));
            }
          }
          break;
        case 500:
        default:
          dispatch(
            setSnackbar(
              'The server encountered an internal error and was unable to complete your request.',
              'error'
            )
          );
          console.error(data);
          break;
      }
    }
    setInputsErrors(newInputErrors);

    // eslint-disable-next-line
  }, [err]);

  return [inputsErrors];
}
