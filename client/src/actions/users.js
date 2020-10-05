import axios from 'axios';

// import action types
import {
  GET_USERS,
  GETTING_USER,
  GET_USER,
  UPDATING_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
  DELETE_USER,
} from './types';

// import actions
import { setSnackbar } from './layout';

// Get users
export const getUsers = () => async dispatch => {
  try {
    const res = await axios.get('/api/users');

    dispatch({
      type: GET_USERS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    }
  }
};

// Get one user by its id
export const getUser = id => async dispatch => {
  dispatch({
    type: GETTING_USER,
  });

  try {
    const res = await axios.get(`/api/users/${id}`);

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    }
  }
};

// Update user
export const updateUser = (id, name, username, password) => async dispatch => {
  dispatch({
    type: UPDATING_USER,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, username, password });

  try {
    const res = await axios.put(`/api/users/${id}`, body, config);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: res.data,
    });

    dispatch(setSnackbar('User Updated', 'success'));
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    } else {
      dispatch({
        type: UPDATE_USER_FAILED,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }
  }
};

// Delete user
export const deleteUser = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/users/${id}`);

    dispatch({
      type: DELETE_USER,
      payload: res.data,
    });

    dispatch(setSnackbar('User Deleted', 'success'));
  } catch (err) {
    // only error is 500 Server Error
    dispatch(setSnackbar('An unexpected error occured.', 'error'));
  }
};
