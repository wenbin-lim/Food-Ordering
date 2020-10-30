import {
  GETTING_USERS,
  GET_USERS,
  GETTING_USER,
  GET_USER,
  ADDING_USER,
  ADD_USER,
  EDITING_USER,
  EDIT_USER,
  DELETING_USER,
  DELETE_USER,
  USER_ERROR,
  LOGOUT,
} from '../actions/types';

const initialState = {
  users: false,
  usersLoading: true,
  user: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_USERS:
      return {
        ...state,
        usersLoading: true,
        errors: null,
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        usersLoading: false,
      };
    case GETTING_USER:
    case ADDING_USER:
    case EDITING_USER:
    case DELETING_USER:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case GET_USER:
      return {
        ...state,
        user: payload,
        requesting: false,
      };
    case ADD_USER:
      return {
        ...state,
        users: Array.isArray(state.users) && [...state.users, payload],
        requesting: false,
      };
    case EDIT_USER:
      return {
        ...state,
        users:
          Array.isArray(state.users) &&
          state.users.map(user => (user._id === payload._id ? payload : user)),
        requesting: false,
      };
    case DELETE_USER:
      return {
        ...state,
        users:
          Array.isArray(state.users) &&
          state.users.filter(user => user._id !== payload),
        requesting: false,
      };
    case USER_ERROR:
      return {
        ...state,
        usersLoading: false,
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
