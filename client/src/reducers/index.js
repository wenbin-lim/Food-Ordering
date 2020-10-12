import { combineReducers } from 'redux';

// import reducers
import users from './users';
import auth from './auth';
import app from './app';
import companies from './companies';

export default combineReducers({
  users,
  auth,
  app,
  companies,
});
