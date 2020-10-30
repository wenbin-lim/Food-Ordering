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
  LOGOUT,
} from '../actions/types';

const initialState = {
  menus: false,
  menusLoading: false,
  menu: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_MENUS:
      return {
        ...state,
        menusLoading: true,
        errors: null,
      };
    case GET_MENUS:
      return {
        ...state,
        menus: payload,
        menusLoading: false,
      };
    case GETTING_MENU:
    case ADDING_MENU:
    case EDITING_MENU:
    case DELETING_MENU:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case GET_MENU:
      return {
        ...state,
        menu: payload,
        requesting: false,
      };
    case ADD_MENU:
      return {
        ...state,
        menus: Array.isArray(state.menus) && [...state.menus, payload],
        requesting: false,
      };
    case EDIT_MENU:
    case DELETE_MENU:
      return {
        ...state,
        menus: payload,
        requesting: false,
      };
    case MENU_ERROR:
      return {
        ...state,
        menusLoading: false,
        requesting: false,
        errors: payload,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
