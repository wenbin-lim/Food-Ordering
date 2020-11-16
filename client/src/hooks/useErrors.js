import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../actions/app';

export default function useErrors(
  err,
  inputs = ['name', 'test'],
  invalidFieldsSnackbar = false
) {
  const dispatch = useDispatch();

  let initialInputsErrors = inputs.reduce((result, inputName) => {
    result[inputName] = '';
    return result;
  }, {});

  const [inputsErrors, setInputsErrors] = useState(initialInputsErrors);

  useEffect(() => {
    let newInputErrors = initialInputsErrors;

    if (err) {
      const { status, data } = err.response;

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
          invalidFieldsSnackbar &&
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
          dispatch(setSnackbar(data, 'error'));
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
