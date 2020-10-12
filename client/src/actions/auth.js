import axios from 'axios';

// import actions
import {
  NO_TOKEN,
  LOAD_TOKEN,
  LOGGING_IN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_AUTH_LOADING,
} from './types';

// import actions
import { setSnackbar } from './app';

// import utils
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadToken = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: LOAD_TOKEN,
        payload: res.data,
      });
    } catch (err) {
      dispatch(
        setSnackbar('An unexpected error occured. Please try again!', 'error')
      );
    }
  } else {
    // no token in localstorage
    dispatch({
      type: NO_TOKEN,
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
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setSnackbar('User created!', 'success'));

    // dispatch(loadUser());
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
    type: LOGGING_IN,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    setAuthToken(res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
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
    payload: null,
  });
};

// table login
export const tableLogin = (companyId, tableId) => async dispatch => {
  dispatch({
    type: LOGGING_IN,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ companyId, tableId });

  try {
    const res = await axios.post('/api/auth/table', body, config);

    setAuthToken(res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    // no need to do anything
    // since if any error user will be shown the company takeaway page
    dispatch({
      type: LOGIN_FAIL,
      payload: null,
    });
  }
};
