import axios from 'axios';

import {
  GETTING_TABLES,
  GET_TABLES,
  GETTING_TABLE,
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
import { setSnackbar, setErrorSnackbar } from './app';

// get list of tables of the company
export const getTables = company => async dispatch => {
  dispatch({
    type: GETTING_TABLES,
  });

  try {
    const params = { company };
    const res = await axios.get('/api/tables', { params });

    dispatch({
      type: GET_TABLES,
      payload: res.data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: TABLE_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// Get one table by its id
export const getTable = id => async dispatch => {
  dispatch({
    type: GETTING_TABLE,
  });

  try {
    const res = await axios.get(`/api/tables/${id}`);

    dispatch({
      type: GET_TABLE,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    if (err.response.status === 500 || err.response.status === 404) {
      dispatch(setSnackbar(err.response.data, 'error'));
    }

    dispatch({
      type: TABLE_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
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

    dispatch(setSnackbar(`Added table of name '${table.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: TABLE_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// edit table
export const editTable = (id, table) => async dispatch => {
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
    const res = await axios.put(`/api/tables/${id}`, body, config);

    dispatch({
      type: EDIT_TABLE,
      payload: res.data,
    });

    dispatch(setSnackbar(`Updated table of name '${table.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: TABLE_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

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

    const { name } = res.data;

    dispatch({
      type: DELETE_TABLE,
      payload: id,
    });

    dispatch(setSnackbar(`Deleted table of name '${name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: TABLE_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
