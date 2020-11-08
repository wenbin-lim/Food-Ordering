import {
  NO_TOKEN,
  TOKEN_LOADED,
  TOKEN_INVALID,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../actions/types';

const initialState = {
  loading: true,
  user: null,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOKEN_LOADED:
      return {
        ...state,
        loading: false,
        user: payload.user,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        loading: false,
        user: payload.user,
      };
    case NO_TOKEN:
    case TOKEN_INVALID:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        loading: false,
        user: null,
        errors: payload,
      };
    default:
      return state;
  }
};
