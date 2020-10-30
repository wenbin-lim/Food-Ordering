// import action types
import {
  GET_COMPANIES_PUBLIC,
  UPDATE_SCREEN_ORIENTATION,
  SET_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../actions/types';

const initialState = {
  screenOrientation: window.innerHeight > window.innerWidth,
  snackbars: [],
  companies: [],
  companiesLoading: true,
};

export default (state = initialState, action) => {
  // eslint-disable-next-line
  const { type, payload } = action;

  switch (type) {
    case GET_COMPANIES_PUBLIC:
      return {
        ...state,
        companies: payload,
        companiesLoading: false,
      };
    // screen is portrait - true (height > width) or landscape - false (width > height)
    case UPDATE_SCREEN_ORIENTATION:
      return {
        ...state,
        screenOrientation: window.innerHeight > window.innerWidth,
      };
    case SET_SNACKBAR:
      return {
        ...state,
        snackbars: [...state.snackbars, payload],
      };
    case REMOVE_SNACKBAR:
      return {
        ...state,
        snackbars: state.snackbars.filter(snackbar => snackbar.id !== payload),
      };
    default:
      return state;
  }
};
