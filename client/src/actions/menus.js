import axios from 'axios';

import {
  GETTING_MENUS,
  GET_MENUS,
  GETTING_MENU,
  GET_MENU,
  ADDING_MENU,
  ADD_MENU,
  EDITING_MENU,
  EDIT_MENU,
  DELETING_MENU,
  DELETE_MENU,
  MENU_ERROR,
} from './types';

// import actions
import { setSnackbar, setErrorSnackbar } from './app';

// get list of menus of the company
export const getMenus = company => async dispatch => {
  dispatch({
    type: GETTING_MENUS,
  });

  try {
    const params = { company };
    const res = await axios.get('/api/menus', { params });

    dispatch({
      type: GET_MENUS,
      payload: res.data,
    });

    return true;
  } catch (err) {
    dispatch({
      type: MENU_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// Get one menu by its id
export const getMenu = id => async dispatch => {
  dispatch({
    type: GETTING_MENU,
  });

  try {
    const res = await axios.get(`/api/menus/${id}`);

    dispatch({
      type: GET_MENU,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: MENU_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};

// add a menu
export const addMenu = (company, menu) => async dispatch => {
  dispatch({
    type: ADDING_MENU,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({
    ...menu,
    company,
  });

  try {
    const res = await axios.post('/api/menus', body, config);

    dispatch({
      type: ADD_MENU,
      payload: res.data,
    });

    dispatch(setSnackbar(`Added menu of name '${menu.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: MENU_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// edit menu
export const editMenu = (id, menu) => async dispatch => {
  dispatch({
    type: EDITING_MENU,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(menu);

  try {
    const res = await axios.put(`/api/menus/${id}`, body, config);

    dispatch({
      type: EDIT_MENU,
      payload: res.data,
    });

    dispatch(setSnackbar(`Updated menu of name '${menu.name}'`, 'success'));

    return true;
  } catch (err) {
    dispatch({
      type: MENU_ERROR,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    });

    return false;
  }
};

// Delete menu
export const deleteMenu = id => async dispatch => {
  dispatch({
    type: DELETING_MENU,
  });

  try {
    const res = await axios.delete(`/api/menus/${id}`);

    const { deletedMenuName, menus } = res.data;

    dispatch({
      type: DELETE_MENU,
      payload: menus,
    });

    dispatch(
      setSnackbar(`Deleted menu of name '${deletedMenuName}'`, 'success')
    );

    return true;
  } catch (err) {
    dispatch({
      type: MENU_ERROR,
      payload: null,
    });

    dispatch(setErrorSnackbar(err.response.data, err.response.status));

    return false;
  }
};
