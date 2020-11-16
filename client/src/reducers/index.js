import { combineReducers } from 'redux';

// import reducers
import auth from './auth';
import app from './app';

export default combineReducers({
  auth,
  app,
});
