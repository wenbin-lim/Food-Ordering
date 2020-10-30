import axios from 'axios';

import {
  GETTING_CUSTOMISATIONS,
  GET_CUSTOMISATIONS,
  GETTING_CUSTOMISATION,
  GET_CUSTOMISATION,
  ADDING_CUSTOMISATION,
  ADD_CUSTOMISATION,
  EDITING_CUSTOMISATION,
  EDIT_CUSTOMISATION,
  DELETING_CUSTOMISATION,
  DELETE_CUSTOMISATION,
  CUSTOMISATION_ERROR,
} from './types';

// import actions
import { setSnackbar, setErrorSnackbar } from './app';

// get list of customisations of the company
export const getCustomisations = company => async dispatch => {
  dispatch({
    type: GETTING_CUSTOMISATIONS,
  });

  try {
    const params = { company };
    const res = await axios.get('/api/customisations', { params });

    dispatch({
      type: GET_CUSTOMISATIONS,
      payload: res.data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: CUSTOMISATION_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// Get one customisation by its id
export const getCustomisation = id => async dispatch => {
  dispatch({
    type: GETTING_CUSTOMISATION,
  });

  try {
    const res = await axios.get(`/api/customisations/${id}`);

    dispatch({
      type: GET_CUSTOMISATION,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: CUSTOMISATION_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// add a customisation
export const addCustomisation = (company, customisation) => async dispatch => {
  dispatch({
    type: ADDING_CUSTOMISATION,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    ...customisation,
    company,
  });

  try {
    const res = await axios.post('/api/customisations', body, config);

    dispatch({
      type: ADD_CUSTOMISATION,
      payload: res.data,
    });

    dispatch(
      setSnackbar(
        `Added customisation of name '${customisation.name}'`,
        'success'
      )
    );

    return true;
  } catch (err) {
    dispatch({
      type: CUSTOMISATION_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// edit customisation
export const editCustomisation = (
  customisationId,
  customisation
) => async dispatch => {
  dispatch({
    type: EDITING_CUSTOMISATION,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(customisation);

  try {
    const res = await axios.put(
      `/api/customisations/${customisationId}`,
      body,
      config
    );

    dispatch({
      type: EDIT_CUSTOMISATION,
      payload: res.data,
    });

    dispatch(
      setSnackbar(
        `Updated customisation of name '${customisation.name}'`,
        'success'
      )
    );

    return true;
  } catch (err) {
    dispatch({
      type: CUSTOMISATION_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// Delete customisation
export const deleteCustomisation = id => async dispatch => {
  dispatch({
    type: DELETING_CUSTOMISATION,
  });

  try {
    const res = await axios.delete(`/api/customisations/${id}`);

    const { name } = res.data;

    dispatch({
      type: DELETE_CUSTOMISATION,
      payload: id,
    });

    dispatch(setSnackbar(`Deleted customisation of name '${name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: CUSTOMISATION_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
