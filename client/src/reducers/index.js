import { combineReducers } from 'redux';

// import reducers
import users from './users';
import auth from './auth';
import layout from './layout';

export default combineReducers({
  users,
  auth,
  layout,
});
