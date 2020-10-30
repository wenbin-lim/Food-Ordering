import { combineReducers } from 'redux';

// import reducers
import users from './users';
import auth from './auth';
import app from './app';
import companies from './companies';
import tables from './tables';
import menus from './menus';
import customisations from './customisations';
import foods from './foods';

export default combineReducers({
  users,
  auth,
  app,
  companies,
  tables,
  menus,
  customisations,
  foods,
});
