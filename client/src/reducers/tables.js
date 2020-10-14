import {
  GETTING_TABLES,
  GET_TABLES,
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
  tables: [],
  tablesLoading: false,
  table: null,
  tableLoading: false,
  tableErrors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_TABLES:
      return {
        ...initialState,
        tablesLoading: true,
      };
    case GET_TABLES:
      return {
        ...state,
        tables: payload,
        tablesLoading: false,
      };
    case ADDING_TABLE:
    case EDITING_TABLE:
    case DELETING_TABLE:
      return {
        ...state,
        table: null,
        tableLoading: true,
        tableErrors: null,
      };
    case GET_TABLE:
      return {
        ...state,
        table: state.tables.find(table => table._id === payload),
      };
    case ADD_TABLE:
      return {
        ...state,
        tables: [payload, ...state.tables],
        tableLoading: false,
      };
    case EDIT_TABLE:
      return {
        ...state,
        tables: state.tables.map(table =>
          table._id === payload._id ? payload : table
        ),
        tableLoading: false,
      };
    case DELETE_TABLE:
      return {
        ...state,
        tables: state.tables.filter(table => table._id !== payload),
        tableErrors: null,
      };
    case TABLE_ERROR:
      return {
        ...state,
        tableLoading: false,
        tableErrors: payload,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
