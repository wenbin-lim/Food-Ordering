import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../actions/app';

const useInputError = (initialState, errors) => {
  if (typeof initialState !== 'object')
    throw new Error('Initial State must be an object type');

  if (typeof errors !== 'object')
    throw new Error('Errors must be an object type');

  const [inputErrorMessages, setInputErrorMessages] = useState(initialState);

  const dispatch = useDispatch();

  useEffect(() => {
    let newErrors = initialState;

    if (errors) {
      const { status, data } = errors;

      switch (status) {
        case 400:
          let invalidFields = false;
          data.forEach(error => {
            if (typeof newErrors[error.param] === 'undefined') {
              dispatch(setSnackbar(error.msg, 'error'));
              console.error(`Input field [${error.param}] is invalid`);
            } else {
              newErrors[error.param] = error.msg;
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
        case 403:
        case 404:
          dispatch(setSnackbar(data, 'error'));
          break;
        case 500:
          dispatch(
            setSnackbar(
              'The server encountered an internal error and was unable to complete your request.',
              'error'
            )
          );
          console.error(data);
          break;
        default:
          break;
      }
    }

    setInputErrorMessages({ ...initialState, noParam: '', ...newErrors });

    // eslint-disable-next-line
  }, [errors]);

  return [inputErrorMessages];
};

export default useInputError;
