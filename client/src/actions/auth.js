import axios from 'axios';

// import actions
import {
  NO_TOKEN,
  TOKEN_LOADED,
  TOKEN_INVALID,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

// import utils
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadToken = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);

    try {
      // decode token in server and return payload
      const res = await axios.get('/api/auth');

      dispatch({
        type: TOKEN_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: TOKEN_INVALID,
        payload: null,
      });

      console.error(err?.response?.data);
    }
  } else {
    // no token in localstorage
    dispatch({
      type: NO_TOKEN,
      payload: null,
    });
  }
};

// Login user
export const login = (username, password) => async dispatch => {
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

    return res.data;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err,
    });

    return false;
  }
};

export const customerLogin = (companyId, tableId) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ companyId, tableId });

  try {
    const res = await axios.post('/api/auth/customer', body, config);

    setAuthToken(res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err,
    });

    return false;
  }
};

// logout user
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT,
    payload: null,
  });
};
