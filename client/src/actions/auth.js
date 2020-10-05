import axios from 'axios';

// import actions
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_AUTH_LOADING,
} from './types';

// import actions
import { setSnackbar } from './layout';

// import utils
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  } else {
    // no token in localstorage
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register a user
export const register = ({ name, username, password }) => async dispatch => {
  dispatch({
    type: SET_AUTH_LOADING,
    payload: true,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, username, password });

  try {
    const res = await axios.post('api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setSnackbar('User created!', 'success'));

    dispatch(loadUser());
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(
        setSnackbar('An unexpected error occured. Please try again!', 'error')
      );
    }

    dispatch({
      type: REGISTER_FAIL,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });
  }
};

// Login user
export const login = (username, password) => async dispatch => {
  dispatch({
    type: SET_AUTH_LOADING,
    payload: true,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const date = new Date();
  const body = JSON.stringify({ username, password, date });

  try {
    const res = await axios.post('api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(setSnackbar('Successfully logged in!', 'success'));

    dispatch(loadUser());
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(
        setSnackbar('An unexpected error occured. Please try again!', 'error')
      );
    }

    dispatch({
      type: LOGIN_FAIL,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });
  }
};

// logout user
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT,
  });
};

// clear auth errors
export const clearAuthError = () => dispatch => {
  dispatch({
    type: CLEAR_AUTH_ERROR,
  });
};
