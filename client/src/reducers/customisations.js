import {
  GETTING_CUSTOMISATIONS,
  GET_CUSTOMISATIONS,
  GETTING_CUSTOMISATION,
  GET_CUSTOMISATION,
  ADDING_CUSTOMISATION,
  ADD_CUSTOMISATION,
  EDITING_CUSTOMISATION,
  EDIT_CUSTOMISATION,
  DELETING_CUSTOMISATION,
  DELETE_CUSTOMISATION,
  CUSTOMISATION_ERROR,
  LOGOUT,
} from '../actions/types';

const initialState = {
  customisations: false,
  customisationsLoading: true,
  customisation: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_CUSTOMISATIONS:
      return {
        ...state,
        customisationsLoading: true,
        errors: null,
      };
    case GET_CUSTOMISATIONS:
      return {
        ...state,
        customisations: payload,
        customisationsLoading: false,
      };
    case GETTING_CUSTOMISATION:
    case ADDING_CUSTOMISATION:
    case EDITING_CUSTOMISATION:
    case DELETING_CUSTOMISATION:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case GET_CUSTOMISATION:
      return {
        ...state,
        customisation: payload,
        requesting: false,
      };
    case ADD_CUSTOMISATION:
      return {
        ...state,
        customisations: Array.isArray(state.customisations) && [
          ...state.customisations,
          payload,
        ],
        requesting: false,
      };
    case EDIT_CUSTOMISATION:
      return {
        ...state,
        customisations:
          Array.isArray(state.customisations) &&
          state.customisations.map(customisation =>
            customisation._id === payload._id ? payload : customisation
          ),
        requesting: false,
      };
    case DELETE_CUSTOMISATION:
      return {
        ...state,
        customisations:
          Array.isArray(state.customisations) &&
          state.customisations.filter(
            customisation => customisation._id !== payload
          ),
        requesting: false,
      };
    case CUSTOMISATION_ERROR:
      return {
        ...state,
        customisationsLoading: false,
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
