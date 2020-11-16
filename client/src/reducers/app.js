// import action types
import {
  UPDATE_SCREEN_ORIENTATION,
  SET_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../actions/types';

const initialState = {
  screenOrientation: window.innerHeight > window.innerWidth,
  snackbars: [],
};

const app = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
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

export default app;
