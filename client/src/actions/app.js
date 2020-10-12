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
export const setSnackbar = (msg, type = '', timeout = 3000) => dispatch => {
  const id = uuid();

  dispatch({
    type: SET_SNACKBAR,
    payload: { msg, type, timeout, id },
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_SNACKBAR,
      payload: id,
    });
  }, timeout);
};

// Remove snackbar
export const removeSnackbar = id => dispatch => {
  dispatch({
    type: REMOVE_SNACKBAR,
    payload: id,
  });
};
