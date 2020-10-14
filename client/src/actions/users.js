import axios from 'axios';

// import action types
import {
  GETTING_USERS,
  GET_USERS,
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
import { setSnackbar } from './app';

// Get users
export const getUsers = companyId => async dispatch => {
  dispatch({
    type: GETTING_USERS,
  });

  try {
    const params = { companyId };
    const res = await axios.get('/api/users', { params });

    dispatch({
      type: GET_USERS,
      payload: res.data,
    });

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    }
    return false;
  }
};

// Get one user by its id
export const getUser = id => async dispatch => {
  dispatch({
    type: GET_USER,
    payload: id,
  });
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

    dispatch(setSnackbar('User created!', 'success'));

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(
        setSnackbar('An unexpected error occured. Please try again!', 'error')
      );
    } else {
      dispatch({
        type: USER_ERROR,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }

    return false;
  }
};

// edit user
export const editUser = (userId, user) => async dispatch => {
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
    const res = await axios.put(`/api/users/${userId}`, body, config);

    dispatch({
      type: EDIT_USER,
      payload: res.data,
    });

    console.log(res.data);
    dispatch(setSnackbar('User Updated', 'success'));

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    } else {
      dispatch({
        type: USER_ERROR,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }

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
