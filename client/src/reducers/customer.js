import {
  TOKEN_LOADED,
  CUSTOMER_LOGIN_SUCCESS,
  CUSTOMER_LOGIN_FAIL,
  CUSTOMER_LOGOUT,
  ADDING_ORDER_TO_BILL,
  ADD_ORDER_TO_BILL_SUCCESS,
  ADD_ORDER_TO_BILL_FAIL,
  CONFIRMING_ORDERS,
  CONFRIM_ORDER_SUCCESS,
  CONFRIM_ORDER_FAIL,
} from '../actions/types';

const initialState = {
  loading: true,
  table: null,
  bill: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOKEN_LOADED:
      return {
        ...state,
        loading: false,
        table: payload.table,
        bill: payload.bill,
      };
    case CUSTOMER_LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        loading: false,
        table: payload.table,
        bill: payload.bill,
      };
    case CUSTOMER_LOGIN_FAIL:
    case CUSTOMER_LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        loading: false,
        table: null,
        bill: null,
        errors: payload,
      };
    case ADDING_ORDER_TO_BILL:
    case CONFIRMING_ORDERS:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case ADD_ORDER_TO_BILL_SUCCESS:
    case CONFRIM_ORDER_SUCCESS:
      return {
        ...state,
        requesting: false,
        bill: payload,
      };
    case ADD_ORDER_TO_BILL_FAIL:
    case CONFRIM_ORDER_FAIL:
      return {
        ...state,
        requesting: false,
        errors: payload,
      };
    default:
      return state;
  }
};
