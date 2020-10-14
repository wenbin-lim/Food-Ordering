import axios from 'axios';

import {
  GETTING_TABLES,
  GET_TABLES,
  GET_TABLE,
  ADDING_TABLE,
  ADD_TABLE,
  EDITING_TABLE,
  EDIT_TABLE,
  DELETING_TABLE,
  DELETE_TABLE,
  TABLE_ERROR,
} from './types';

// import actions
import { setSnackbar } from './app';

// get list of tables of the company
export const getTables = companyId => async dispatch => {
  dispatch({
    type: GETTING_TABLES,
  });

  try {
    const params = { companyId };
    const res = await axios.get('/api/tables', { params });

    dispatch({
      type: GET_TABLES,
      payload: res.data,
    });

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    }
    return false;
  }
};

// Get one table by its id
export const getTable = id => async dispatch => {
  dispatch({
    type: GET_TABLE,
    payload: id,
  });
};

// add a table
export const addTable = (company, table) => async dispatch => {
  dispatch({
    type: ADDING_TABLE,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    ...table,
    company,
  });

  try {
    const res = await axios.post('/api/tables', body, config);

    dispatch({
      type: ADD_TABLE,
      payload: res.data,
    });

    dispatch(setSnackbar('Table created!', 'success'));

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(
        setSnackbar('An unexpected error occured. Please try again!', 'error')
      );
    } else {
      dispatch({
        type: TABLE_ERROR,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }

    return false;
  }
};

// edit table
export const editTable = (tableId, table) => async dispatch => {
  dispatch({
    type: EDITING_TABLE,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(table);

  try {
    const res = await axios.put(`/api/tables/${tableId}`, body, config);

    dispatch({
      type: EDIT_TABLE,
      payload: res.data,
    });

    dispatch(setSnackbar('Table Updated', 'success'));

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    } else {
      dispatch({
        type: TABLE_ERROR,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }

    return false;
  }
};

// Delete table
export const deleteTable = id => async dispatch => {
  dispatch({
    type: DELETING_TABLE,
  });

  try {
    const res = await axios.delete(`/api/tables/${id}`);

    console.log(res.data);
    dispatch({
      type: DELETE_TABLE,
      payload: res.data,
    });

    dispatch(setSnackbar('Table Deleted', 'success'));
  } catch (err) {
    // only error is 500 Server Error
    dispatch(setSnackbar('An unexpected error occured.', 'error'));
  }
};
