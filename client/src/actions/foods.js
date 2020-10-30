import axios from 'axios';

import {
  GETTING_FOODS,
  GET_FOODS,
  GETTING_FOOD,
  GET_FOOD,
  ADDING_FOOD,
  ADD_FOOD,
  EDITING_FOOD,
  EDIT_FOOD,
  DELETING_FOOD,
  DELETE_FOOD,
  FOOD_ERROR,
} from './types';

// import actions
import { setSnackbar, setErrorSnackbar } from './app';

// get list of foods of the company
export const getFoods = company => async dispatch => {
  dispatch({
    type: GETTING_FOODS,
  });

  try {
    const params = { company };
    const res = await axios.get('/api/foods', { params });

    dispatch({
      type: GET_FOODS,
      payload: res.data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// Get one food by its id
export const getFood = id => async dispatch => {
  dispatch({
    type: GETTING_FOOD,
  });

  try {
    const res = await axios.get(`/api/foods/${id}`);

    dispatch({
      type: GET_FOOD,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// add a food
export const addFood = (company, food) => async dispatch => {
  dispatch({
    type: ADDING_FOOD,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    ...food,
    company,
  });

  try {
    const res = await axios.post('/api/foods', body, config);

    dispatch({
      type: ADD_FOOD,
      payload: res.data,
    });

    dispatch(setSnackbar(`Added food of name '${food.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// edit food
export const editFood = (id, food) => async dispatch => {
  dispatch({
    type: EDITING_FOOD,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(food);

  try {
    const res = await axios.put(`/api/foods/${id}`, body, config);

    dispatch({
      type: EDIT_FOOD,
      payload: res.data,
    });

    dispatch(setSnackbar(`Updated food of name '${food.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// Delete food
export const deleteFood = id => async dispatch => {
  dispatch({
    type: DELETING_FOOD,
  });

  try {
    const res = await axios.delete(`/api/foods/${id}`);

    const { name } = res.data;

    dispatch({
      type: DELETE_FOOD,
      payload: id,
    });

    dispatch(setSnackbar(`Deleted food of name '${name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
