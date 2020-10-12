import { useState, useEffect } from 'react';

const useInputError = (initialState, errorsFromRedux) => {
  if (typeof initialState !== 'object')
    throw 'Initial State must be an object type';

  if (typeof errorsFromRedux !== 'object')
    throw 'Errors from redux must be an object type';

  const [inputErrorMessages, setInputErrorMessages] = useState({
    ...initialState,
    noParam: '',
  });

  useEffect(() => {
    const newErrors = {};

    if (errorsFromRedux && errorsFromRedux.status === 400) {
      errorsFromRedux.data.forEach(error => {
        newErrors[error.param] = error.msg;
      });
    } else if (errorsFromRedux && errorsFromRedux.status === 403) {
      newErrors.noParam = errorsFromRedux.data;
    }

    setInputErrorMessages({ ...initialState, noParam: '', ...newErrors });
  }, [errorsFromRedux]);

  return [inputErrorMessages];
};

export default useInputError;
