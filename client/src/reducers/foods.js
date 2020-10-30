import {
  GETTING_FOODS,
  GET_FOODS,
  GETTING_FOOD,
  GET_FOOD,
  ADDING_FOOD,
  ADD_FOOD,
  EDITING_FOOD,
  EDIT_FOOD,
  DELETING_FOOD,
  DELETE_FOOD,
  FOOD_ERROR,
  LOGOUT,
} from '../actions/types';

const initialState = {
  foods: false,
  foodsLoading: false,
  food: null,
  requesting: false,
  errors: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GETTING_FOODS:
      return {
        ...state,
        foodsLoading: true,
        errors: null,
      };
    case GET_FOODS:
      return {
        ...state,
        foods: payload,
        foodsLoading: false,
      };
    case GETTING_FOOD:
    case ADDING_FOOD:
    case EDITING_FOOD:
    case DELETING_FOOD:
      return {
        ...state,
        requesting: true,
        errors: null,
      };
    case GET_FOOD:
      return {
        ...state,
        food: payload,
        requesting: false,
      };
    case ADD_FOOD:
      return {
        ...state,
        foods: Array.isArray(state.foods) && [...state.foods, payload],
        requesting: false,
      };
    case EDIT_FOOD:
      return {
        ...state,
        foods:
          Array.isArray(state.foods) &&
          state.foods.map(food => (food._id === payload._id ? payload : food)),
        requesting: false,
      };
    case DELETE_FOOD:
      return {
        ...state,
        foods:
          Array.isArray(state.foods) &&
          state.foods.filter(food => food._id !== payload),
        requesting: false,
      };
    case FOOD_ERROR:
      return {
        ...state,
        foodsLoading: false,
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
