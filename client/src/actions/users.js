import axios from 'axios';

import {
  GETTING_USERS,
  GET_USERS,
  GETTING_USER,
  GET_USER,
  ADDING_USER,
  ADD_USER,
  EDITING_USER,
  EDIT_USER,
  DELETE_USER,
  USER_ERROR,
  DELETING_USER,
} from './types';

// import actions
import { setSnackbar, setErrorSnackbar } from './app';

// Get users
export const getUsers = company => async dispatch => {
  dispatch({
    type: GETTING_USERS,
  });

  try {
    const params = { company };
    const res = await axios.get('/api/users', { params });

    dispatch({
      type: GET_USERS,
      payload: res.data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
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

    return res.data;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// add a user
export const addUser = (company, user) => async dispatch => {
  dispatch({
    type: ADDING_USER,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    ...user,
    company,
  });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: ADD_USER,
      payload: res.data,
    });

    dispatch(setSnackbar(`Added user of name '${user.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// edit user
export const editUser = (id, user) => async dispatch => {
  dispatch({
    type: EDITING_USER,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(user);

  try {
    const res = await axios.put(`/api/users/${id}`, body, config);

    dispatch({
      type: EDIT_USER,
      payload: res.data,
    });

    dispatch(setSnackbar(`Updated user of name '${user.name}'`, 'success'));

    return true;
  } catch (err) {
    console.error(err);
    dispatch({
      type: USER_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// Delete user
export const deleteUser = id => async dispatch => {
  dispatch({
    type: DELETING_USER,
  });

  try {
    const res = await axios.delete(`/api/users/${id}`);

    const { name } = res.data;

    dispatch({
      type: DELETE_USER,
      payload: id,
    });

    dispatch(setSnackbar(`Deleted user of name '${name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
