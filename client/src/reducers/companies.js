// import action types
import {
  GET_COMPANIES,
  GETTING_COMPANY,
  GET_COMPANY,
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
  companies: [],
  companiesLoading: true,
  company: null,
  companyLoading: false,
  companyErrors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
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
        company: null,
        companyLoading: true,
      };
    case GET_COMPANY:
      return {
        ...state,
        company: state.companies.find(company => company._id === payload),
        companyLoading: false,
        companyErrors: null,
      };
    case ADD_COMPANY:
      return {
        ...state,
        companies: [payload, ...state.companies],
        companyLoading: false,
      };
    case EDIT_COMPANY:
      return {
        ...state,
        companies: state.companies.map(company =>
          company._id === payload._id ? payload : company
        ),
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(company => company._id !== payload),
        errors: null,
      };
    case COMPANY_ERROR:
      return {
        ...state,
        companyLoading: false,
        companyErrors: payload,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
