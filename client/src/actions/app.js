import axios from 'axios';
import { v4 as uuid } from 'uuid';

// import action types
import {
  GET_COMPANIES_PUBLIC,
  UPDATE_SCREEN_ORIENTATION,
  SET_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../actions/types';

// get list of companies for public
export const getCompaniesPublic = () => async dispatch => {
  const res = await axios.get('/api/companies');

  try {
    dispatch({
      type: GET_COMPANIES_PUBLIC,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
  }
};

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
  timeout = 2000
) => dispatch => {
  const id = uuid();

  dispatch({
    type: SET_SNACKBAR,
    payload: { msg, type, timeout, id, action },
  });

  setTimeout(() => {
    dispatch(removeSnackbar(id));
  }, timeout);
};

// Set snackbar based on error status
export const setErrorSnackbar = (data, status) => dispatch => {
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
