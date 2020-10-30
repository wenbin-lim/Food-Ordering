import axios from 'axios';

import {
  GETTING_COMPANIES,
  GET_COMPANIES,
  GETTING_COMPANY,
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
import { setSnackbar, setErrorSnackbar } from './app';

// Get companies
export const getCompanies = () => async dispatch => {
  dispatch({
    type: GETTING_COMPANIES,
  });

  try {
    const res = await axios.get('/api/companies');

    dispatch({
      type: GET_COMPANIES,
      payload: res.data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: COMPANY_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// Get company by id
export const getCompany = id => async dispatch => {
  dispatch({
    type: GETTING_COMPANY,
  });

  try {
    const res = await axios.get(`/api/companies/${id}`);

    dispatch({
      type: GET_COMPANY,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: COMPANY_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// Add new company
export const addCompany = company => async dispatch => {
  dispatch({
    type: ADDING_COMPANY,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(company);

  try {
    const res = await axios.post(`/api/companies`, body, config);

    dispatch({
      type: ADD_COMPANY,
      payload: res.data,
    });

    dispatch(setSnackbar(`Added company of name '${company.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: COMPANY_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

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

  const body = JSON.stringify(company);

  try {
    const res = await axios.put(`/api/companies/${id}`, body, config);

    dispatch({
      type: EDIT_COMPANY,
      payload: res.data,
    });

    dispatch(
      setSnackbar(`Updated company of name '${company.name}'`, 'success')
    );

    return true;
  } catch (err) {
    dispatch({
      type: COMPANY_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

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

    const { displayedName } = res.data;

    dispatch({
      type: DELETE_COMPANY,
      payload: id,
    });

    dispatch(
      setSnackbar(`Deleted company of name '${displayedName}'`, 'success')
    );

    return true;
  } catch (err) {
    dispatch({
      type: COMPANY_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
