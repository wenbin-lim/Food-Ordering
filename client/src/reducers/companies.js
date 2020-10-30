// import action types
import {
  GETTING_COMPANIES,
  GET_COMPANIES,
  GET_COMPANY,
  GETTING_COMPANY,
  ADDING_COMPANY,
  ADD_COMPANY,
  EDITING_COMPANY,
  EDIT_COMPANY,
  DELETING_COMPANY,
  DELETE_COMPANY,
  COMPANY_ERROR,
  LOGOUT,
} from '../actions/types';

const initialState = {
  companies: false,
  companiesLoading: false,
  company: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_COMPANIES:
      return {
        ...state,
        companiesLoading: true,
        errors: null,
      };
    case GET_COMPANIES:
      return {
        ...state,
        companies: payload,
        companiesLoading: false,
      };
    case GETTING_COMPANY:
    case ADDING_COMPANY:
    case EDITING_COMPANY:
    case DELETING_COMPANY:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case GET_COMPANY:
      return {
        ...state,
        company: payload,
        requesting: false,
      };
    case ADD_COMPANY:
      return {
        ...state,
        companies: Array.isArray(state.companies) && [
          ...state.companies,
          payload,
        ],
        requesting: false,
      };
    case EDIT_COMPANY:
      return {
        ...state,
        companies:
          Array.isArray(state.companies) &&
          state.companies.map(company =>
            company._id === payload._id ? payload : company
          ),
        requesting: false,
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies:
          Array.isArray(state.companies) &&
          state.companies.filter(company => company._id !== payload),
        requesting: false,
      };
    case COMPANY_ERROR:
      return {
        ...state,
        companyLoading: false,
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
