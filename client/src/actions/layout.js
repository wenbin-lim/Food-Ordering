import { v4 as uuid } from 'uuid';

// import action types
import {
  APP_LOADED,
  UPDATE_SCREEN_ORIENTATION,
  SET_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../actions/types';

export const loadApp = () => dispatch => {
  dispatch({
    type: APP_LOADED,
  });
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
