// import action types

import {
  GET_USERS,
  GETTING_USER,
  GET_USER,
  UPDATING_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
  DELETE_USER,
} from '../actions/types';

const initialState = {
  users: [],
  userListLoading: true,
  user: null,
  userLoading: false,
  userUpdateLoading: false,
  userUpdateErrors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USERS:
      return {
        ...state,
        users: payload,
        userListLoading: false,
      };
    case GETTING_USER:
      return {
        ...state,
        user: null,
        userLoading: true,
        userUpdateErrors: null,
      };
    case GET_USER:
      return {
        ...state,
        user: payload,
        userLoading: false,
      };
    case UPDATING_USER:
      return {
        ...state,
        userUpdateLoading: true,
        userUpdateErrors: null,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user => {
          if (payload._id === user._id) {
            return payload;
          }
          return user;
        }),
        userUpdateLoading: false,
        userUpdateErrors: null,
      };
    case UPDATE_USER_FAILED:
      return {
        ...state,
        userUpdateLoading: false,
        userUpdateErrors: payload,
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== payload.userId),
        errors: null,
      };
    default:
      return state;
  }
};
