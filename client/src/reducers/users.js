// import action types

import {
  GETTING_USERS,
  GET_USERS,
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
  users: [],
  usersLoading: false,
  user: null,
  userLoading: false,
  userErrors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_USERS:
      return {
        ...initialState,
        usersLoading: true,
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        usersLoading: false,
      };
    case ADDING_USER:
    case EDITING_USER:
    case DELETING_USER:
      return {
        ...state,
        user: null,
        userLoading: true,
        userErrors: null,
      };
    case GET_USER:
      return {
        ...state,
        user: state.users.find(user => user._id === payload),
      };
    case ADD_USER:
      return {
        ...state,
        users: [payload, ...state.users],
        userLoading: false,
      };
    case EDIT_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === payload._id ? payload : user
        ),
        userLoading: false,
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== payload),
        userErrors: null,
      };
    case USER_ERROR:
      return {
        ...state,
        userLoading: false,
        userErrors: payload,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
