import axios from 'axios';

// import actions
import {
  CUSTOMER_LOGIN_SUCCESS,
  CUSTOMER_LOGIN_FAIL,
  // eslint-disable-next-line
  CUSTOMER_LOGOUT,
  ADDING_ORDER_TO_BILL,
  ADD_ORDER_TO_BILL_SUCCESS,
  ADD_ORDER_TO_BILL_FAIL,
  CONFIRMING_ORDERS,
  CONFRIM_ORDER_SUCCESS,
  CONFRIM_ORDER_FAIL,
} from './types';

// import actions
import { setSnackbar, setErrorSnackbar } from './app';

// import utils
import setAuthToken from '../utils/setAuthToken';

// customer login
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
      type: CUSTOMER_LOGIN_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: CUSTOMER_LOGIN_FAIL,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

export const addOrder = (
  billId,
  orderId,
  foodId,
  foodQty,
  foodPrice,
  additionalInstruction,
  customisations
) => async dispatch => {
  dispatch({
    type: ADDING_ORDER_TO_BILL,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    orderId,
    foodId,
    foodQty,
    foodPrice,
    additionalInstruction,
    customisations,
  });

  try {
    const res = await axios.put(
      `/api/bills/${billId}/orders/new`,
      body,
      config
    );

    dispatch({
      type: ADD_ORDER_TO_BILL_SUCCESS,
      payload: res.data,
    });

    dispatch(
      setSnackbar(
        `${orderId ? 'Edited' : 'Added'} food ${orderId ? 'in' : 'to'} cart`,
        'success'
      )
    );

    return true;
  } catch (err) {
    dispatch({
      type: ADD_ORDER_TO_BILL_FAIL,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

export const confirmOrders = (billId, orders) => async dispatch => {
  dispatch({
    type: CONFIRMING_ORDERS,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ orders });

  try {
    const res = await axios.put(
      `/api/bills/${billId}/orders/confirm`,
      body,
      config
    );

    dispatch({
      type: CONFRIM_ORDER_SUCCESS,
      payload: res.data,
    });

    dispatch(setSnackbar('Orders confirmed', 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: CONFRIM_ORDER_FAIL,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
