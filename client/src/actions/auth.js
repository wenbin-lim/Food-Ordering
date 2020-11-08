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

      const { user, table, bill } = res.data;

      dispatch({
        type: TOKEN_LOADED,
        payload: { user, table, bill },
      });
    } catch (err) {
      console.error(err);

      dispatch({
        type: TOKEN_INVALID,
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
