import { v4 as uuid } from 'uuid';

// import action types
import {
  UPDATE_SCREEN_ORIENTATION,
  SET_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../actions/types';

// update screen orientation
export const updateScreenOrientation = () => dispatch => {
  dispatch({
    type: UPDATE_SCREEN_ORIENTATION,
  });
};

// Set snackbar
export const setSnackbar = (
  msg,
  type = '',
  action,
  timeout = 1500
) => dispatch => {
  const id = uuid();

  dispatch({
    type: SET_SNACKBAR,
    payload: { msg, type, timeout, id, action },
  });

  if (timeout !== 0) {
    setTimeout(() => {
      dispatch(removeSnackbar(id));
    }, timeout);
  }
};

// Set snackbar based on error status
export const setErrorSnackbar = error => dispatch => {
  const { status, data } = error?.response;

  switch (status) {
    case 400:
      data.forEach(error => {
        dispatch(setSnackbar(error.msg, 'error'));
        console.error(
          `Error occured in location [${error.location}], param [${error.param}] with value [${error.value}]`
        );
      });
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
};

// Remove snackbar
export const removeSnackbar = id => dispatch => {
  dispatch({
    type: REMOVE_SNACKBAR,
    payload: id,
  });
};
