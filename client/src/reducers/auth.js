import {
  LOAD_TOKEN,
  LOAD_TOKEN_FAIL,
  NO_TOKEN,
  LOGGING_IN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from '../actions/types';

const initialState = {
  loading: true,
  auth: null,
  access: 0,
  company: null,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGGING_IN:
      localStorage.removeItem('token');
      return {
        ...initialState,
      };
    case LOAD_TOKEN:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      delete payload.token;
      return {
        ...state,
        ...payload,
        loading: false,
      };
    case LOAD_TOKEN_FAIL:
    case NO_TOKEN:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...initialState,
        loading: false,
        errors: payload,
      };
    default:
      return state;
  }
};
