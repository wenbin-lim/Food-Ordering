// import action types
import {
  APP_LOADED,
  UPDATE_SCREEN_ORIENTATION,
  SET_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../actions/types';

const initialState = {
  appLoaded: false,
  screenOrientation: window.innerHeight > window.innerWidth,
  snackbars: [],
};

export default (state = initialState, action) => {
  // eslint-disable-next-line
  const { type, payload } = action;

  switch (type) {
    case APP_LOADED:
      return {
        ...state,
        appLoaded: true,
      };
    // screen is portrait - true (height > width) or landscape - false (width > height)
    case UPDATE_SCREEN_ORIENTATION:
      return {
        ...state,
        screenOrientation: !state.screenOrientation,
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
