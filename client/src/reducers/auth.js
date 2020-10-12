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
} from '../actions/types';

const initialState = {
  loading: false,
  auth: null,
  access: 0,
  company: null,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case NO_TOKEN:
      return {
        ...initialState,
      };
    case LOAD_TOKEN:
      return {
        ...state,
        ...payload,
      };
    case LOGGING_IN:
      return {
        ...initialState,
        loading: true,
      };
    case LOGIN_SUCCESS:
      // case TABLE_LOGIN_SUCCESS:
      //   // case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        loading: false,
      };
    // case AUTH_ERROR:
    case LOGIN_FAIL:
    // // case REGISTER_FAIL:
    case LOGOUT:
      // case TABLE_LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...initialState,
        loading: false,
        errors: payload,
      };
    // case SET_AUTH_LOADING:
    //   localStorage.removeItem('token');
    //   return {
    //     ...initialState,
    //     token: null,
    //     loading: payload,
    //   };
    default:
      return state;
  }
};
