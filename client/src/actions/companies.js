import axios from 'axios';

// import action types
import {
  GET_COMPANIES,
  GET_COMPANY,
  ADDING_COMPANY,
  ADD_COMPANY,
  EDITING_COMPANY,
  EDIT_COMPANY,
  DELETING_COMPANY,
  DELETE_COMPANY,
  COMPANY_ERROR,
} from '../actions/types';

// import actions
import { setSnackbar } from './app';

// Get companies
export const getCompanies = () => async dispatch => {
  try {
    const res = await axios.get('/api/companies');

    dispatch({
      type: GET_COMPANIES,
      payload: res.data,
    });
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    }
  }
};

// Get company by id
export const getCompany = id => dispatch => {
  dispatch({
    type: GET_COMPANY,
    payload: id,
  });
};

// Add new company
export const addCompany = newCompany => async dispatch => {
  dispatch({
    type: ADDING_COMPANY,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(newCompany);

  try {
    const res = await axios.post(`/api/companies/`, body, config);

    dispatch({
      type: ADD_COMPANY,
      payload: res.data,
    });

    dispatch(setSnackbar('Company Added', 'success'));

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    } else {
      dispatch({
        type: COMPANY_ERROR,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }

    return false;
  }
};

// Edit company
export const editCompany = (id, company) => async dispatch => {
  dispatch({
    type: EDITING_COMPANY,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('er');

  const body = JSON.stringify(company);

  try {
    const res = await axios.put(`/api/companies/${id}`, body, config);

    dispatch({
      type: EDIT_COMPANY,
      payload: res.data,
    });

    dispatch(setSnackbar('Company Edited', 'success'));

    return true;
  } catch (err) {
    if (err.response.status === 500) {
      dispatch(setSnackbar('An unexpected error occured.', 'error'));
    } else {
      dispatch({
        type: COMPANY_ERROR,
        payload: {
          status: err.response.status,
          data: err.response.data,
        },
      });
    }

    return false;
  }
};

// Delete company
export const deleteCompany = id => async dispatch => {
  dispatch({
    type: DELETING_COMPANY,
  });

  try {
    const res = await axios.delete(`/api/companies/${id}`);

    dispatch({
      type: DELETE_COMPANY,
      payload: res.data,
    });

    dispatch(setSnackbar('Company Deleted', 'success'));
  } catch (err) {
    // only error is 500 Server Error
    dispatch(setSnackbar('An unexpected error occured.', 'error'));
  }
};
