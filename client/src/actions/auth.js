import axios from 'axios';

// import actions
import {
  LOAD_TOKEN,
  LOAD_TOKEN_FAIL,
  NO_TOKEN,
  LOGGING_IN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

// import actions
import { setErrorSnackbar } from './app';

// import utils
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadToken = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);

    try {
      // decode token in server and return payload
      const res = await axios.get('/api/auth');

      // store payload in redux state
      dispatch({
        type: LOAD_TOKEN,
        payload: res.data,
      });
    } catch (err) {
      console.error(err);
      dispatch(setErrorSnackbar(err.response.data, err.response.status));

      dispatch({
        type: LOAD_TOKEN_FAIL,
        payload: null,
      });
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
