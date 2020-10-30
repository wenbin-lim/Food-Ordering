import {
  GETTING_TABLES,
  GET_TABLES,
  GETTING_TABLE,
  GET_TABLE,
  ADDING_TABLE,
  ADD_TABLE,
  EDITING_TABLE,
  EDIT_TABLE,
  DELETING_TABLE,
  DELETE_TABLE,
  TABLE_ERROR,
  LOGOUT,
} from '../actions/types';

const initialState = {
  tables: false,
  tablesLoading: true,
  table: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_TABLES:
      return {
        ...state,
        tablesLoading: true,
        errors: null,
      };
    case GET_TABLES:
      return {
        ...state,
        tables: payload,
        tablesLoading: false,
      };
    case GETTING_TABLE:
    case ADDING_TABLE:
    case EDITING_TABLE:
    case DELETING_TABLE:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case GET_TABLE:
      return {
        ...state,
        table: payload,
        requesting: false,
      };
    case ADD_TABLE:
      return {
        ...state,
        tables: Array.isArray(state.tables) && [payload, ...state.tables],
        requesting: false,
      };
    case EDIT_TABLE:
      return {
        ...state,
        tables:
          Array.isArray(state.tables) &&
          state.tables.map(table =>
            table._id === payload._id ? payload : table
          ),
        requesting: false,
      };
    case DELETE_TABLE:
      return {
        ...state,
        tables:
          Array.isArray(state.tables) &&
          state.tables.filter(table => table._id !== payload),
        requesting: false,
      };
    case TABLE_ERROR:
      return {
        ...state,
        tablesLoading: false,
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
