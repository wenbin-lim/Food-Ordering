import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../actions/app';

export default function useErrors(err, inputs = ['name', 'test']) {
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
          let invalidFields = false;
          data.forEach(({ param, msg }) => {
            if (typeof newInputErrors[param] === 'undefined') {
              dispatch(setSnackbar(msg, 'error'));
              console.error(`Input field [${param}] is invalid`);
            } else {
              newInputErrors[param] = msg;
              invalidFields = true;
            }
          });
          invalidFields &&
            dispatch(
              setSnackbar(
                'Some invalid fields exists. Please try again!',
                'error'
              )
            );
          break;
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
  }, [err]);

  return inputsErrors;
}
