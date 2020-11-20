/* eslint-disable */
import React, { useEffect } from 'react';
import './App.css';

// Router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// React query devtools
import { ReactQueryDevtools } from 'react-query-devtools';

// Auth components
import WawayaRoute from './routing/WawayaRoute';
import CompanyRoute from './routing/CompanyRoute';
import CustomerRoute from './routing/CustomerRoute';

// Components
import Snackbar from './components/layout/Snackbar';

// Wawaya Main Pages
import MainAppWrapper from './routes/main/MainAppWrapper';
import Landing from './routes/main/Landing';
import About from './routes/main/About';
import Login from './routes/main/Login';
import Contact from './routes/main/Contact';
// import OrderNow from './routes/ordernow/OrderNow';

// Customer App Pages
import CustomerLogin from './routes/customer/CustomerLogin';
import CustomerAppWrapper from './routes/customer/CustomerAppWrapper';
import CustomerLanding from './routes/customer/CustomerLanding';
import Cart from './routes/customer/Cart';
// import CustomerTakeaway from './routes/customer/CustomerTakeaway';

// Company/Main App Pages
import CompanyAppWrapper from './routes/company/CompanyAppWrapper';
import CompanyLanding from './routes/company/CompanyLanding';
import AdminDashboard from './routes/company/admin/AdminDashboard';

import CompanyUsers from './routes/company/users/CompanyUsers';
import CompanyTables from './routes/company/tables/CompanyTables';
import CompanyMenus from './routes/company/menus/CompanyMenus';
import CompanyFoods from './routes/company/foods/CompanyFoods';
import CompanyCustomisations from './routes/company/customisations/CompanyCustomisations';

import MainMenu from './components/menus/MainMenu';
import Menu from './components/menus/Menu';
// import Waiter from './routes/company/waiter/Waiter';
import Kitchen from './routes/company/kitchen/Kitchen';
// import Cashier from './routes/company/cashier/Cashier';
// // import Notifications from './routes/company/notifications/Notifications';

// Wawaya Master Pages
import WawayaAppWrapper from './routes/wawaya/WawayaAppWrapper';
import WawayaDashboard from './routes/wawaya/WawayaDashboard';
import Companies from './routes/wawaya/companies/Companies';
import Company from './routes/wawaya/companies/Company';
import CompanyAdd from './routes/wawaya/companies/CompanyAdd';
import CompanyEdit from './routes/wawaya/companies/CompanyEdit';
import Users from './routes/wawaya/users/Users';
import Tables from './routes/wawaya/tables/Tables';
import Menus from './routes/wawaya/menus/Menus';
import Foods from './routes/wawaya/foods/Foods';
import Customisations from './routes/wawaya/customisations/Customisations';

// Reused Components
import UserAdd from './components/users/UserAdd';
import User from './components/users/User';
import UserEdit from './components/users/UserEdit';

import TableAdd from './components/tables/TableAdd';
import Table from './components/tables/Table';
import TableEdit from './components/tables/TableEdit';

import MenuAdd from './components/menus/MenuAdd';
import MenuInfo from './components/menus/MenuInfo';
import MenuEdit from './components/menus/MenuEdit';

import FoodAdd from './components/foods/FoodAdd';
import FoodInfo from './components/foods/FoodInfo';
import FoodEdit from './components/foods/FoodEdit';

import CustomisationAdd from './components/customisations/CustomisationAdd';
import Customisation from './components/customisations/Customisation';
import CustomisationEdit from './components/customisations/CustomisationEdit';

// Functions
import useGet from './query/hooks/useGet';
import { updateScreenOrientation } from './actions/app';
import { loadToken } from './actions/auth';

const App = () => {
  // useGet('companies', {
  //   route: '/api/companies',
  // });

  useEffect(() => {
    const layoutEvents = ['resize', 'deviceorientation', 'orientationchange'];

    const updateLayoutVariables = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight / 100}px`
      );
      store.dispatch(updateScreenOrientation());
    };

    // init
    updateLayoutVariables();

    layoutEvents.forEach(event =>
      window.addEventListener(event, updateLayoutVariables)
    );

    // store
    // populate list of companies in app level app state for route population
    // store.dispatch(getCompaniesPublic());
    store.dispatch(loadToken());

    return () => {
      layoutEvents.forEach(event =>
        window.removeEventListener(event, updateLayoutVariables)
      );
    };

    // eslint-disable-next-line
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<MainAppWrapper />}>
            <Route path='' element={<Landing />} />
            <Route path='login' element={<Login />} />
            <Route path='about' element={<About />} />
            <Route path='contact' element={<Contact />} />
          </Route>

          <Route
            path='takeaway/:companyName'
            element={<div>customer takeaway</div>}
          />

          <Route path='dinein' element={<CustomerLogin />} />

          {/* prettier-ignore */}
          <CustomerRoute path='dinein/:companyName' element={<CustomerAppWrapper />} >
            <CustomerRoute path='/' element={<CustomerLanding/>} />
            <CustomerRoute path='menu' element={<MainMenu />} />
            <CustomerRoute path='menu/:id' element={<Menu />} />
            <CustomerRoute path='cart' element={<Cart />} />
          </CustomerRoute>

          <WawayaRoute path='/wawaya' element={<WawayaAppWrapper />}>
            <WawayaRoute path='/' element={<WawayaDashboard />} />

            <WawayaRoute path='companies' element={<Companies />}>
              <WawayaRoute path='add' element={<CompanyAdd />} />
              <WawayaRoute path=':id' element={<Company />} />
              <WawayaRoute path=':id/edit' element={<CompanyEdit />} />
            </WawayaRoute>

            <WawayaRoute path='users' element={<Users />}>
              <WawayaRoute path='add' element={<UserAdd />} />
              <WawayaRoute path=':id' element={<User />} />
              <WawayaRoute path=':id/edit' element={<UserEdit />} />
            </WawayaRoute>

            <WawayaRoute path='tables' element={<Tables />}>
              <WawayaRoute path='add' element={<TableAdd />} />
              <WawayaRoute path=':id' element={<Table />} />
              <WawayaRoute path=':id/edit' element={<TableEdit />} />
            </WawayaRoute>

            <WawayaRoute path='menus' element={<Menus />}>
              <WawayaRoute path='add' element={<MenuAdd />} />
              <WawayaRoute path=':id' element={<MenuInfo />} />
              <WawayaRoute path=':id/edit' element={<MenuEdit />} />
            </WawayaRoute>

            <WawayaRoute path='foods' element={<Foods />}>
              <WawayaRoute path='add' element={<FoodAdd />} />
              <WawayaRoute path=':id' element={<FoodInfo />} />
              <WawayaRoute path=':id/edit' element={<FoodEdit />} />
            </WawayaRoute>

            <WawayaRoute path='customisations' element={<Customisations />}>
              <WawayaRoute path='add' element={<CustomisationAdd />} />
              <WawayaRoute path=':id' element={<Customisation />} />
              <WawayaRoute path=':id/edit' element={<CustomisationEdit />} />
            </WawayaRoute>
          </WawayaRoute>

          <CompanyRoute path='/:companyName' element={<CompanyAppWrapper />}>
            <CompanyRoute path='/' element={<CompanyLanding />} />

            {/* prettier-ignore */}
            <CompanyRoute path='admin' access={3} element={<AdminDashboard />} />

            <CompanyRoute path='users' access={3} element={<CompanyUsers />}>
              <CompanyRoute path='add' access={3} element={<UserAdd />} />
              <CompanyRoute path=':id' access={3} element={<User />} />
              <CompanyRoute path=':id/edit' access={3} element={<UserEdit />} />
            </CompanyRoute>

            <CompanyRoute path='tables' access={3} element={<CompanyTables />}>
              <CompanyRoute path='add' access={3} element={<TableAdd />} />
              <CompanyRoute path=':id' access={3} element={<Table />} />
              {/* prettier-ignore */}
              <CompanyRoute path=':id/edit' access={3} element={<TableEdit />} />
            </CompanyRoute>

            <CompanyRoute path='menus' access={3} element={<CompanyMenus />}>
              <CompanyRoute path='add' access={3} element={<MenuAdd />} />
              <CompanyRoute path=':id' access={3} element={<MenuInfo />} />
              <CompanyRoute path=':id/edit' access={3} element={<MenuEdit />} />
            </CompanyRoute>

            <CompanyRoute path='foods' access={3} element={<CompanyFoods />}>
              <CompanyRoute path='add' access={3} element={<FoodAdd />} />
              <CompanyRoute path=':id' access={3} element={<FoodInfo />} />
              <CompanyRoute path=':id/edit' access={3} element={<FoodEdit />} />
            </CompanyRoute>

            {/* prettier-ignore */}
            <CompanyRoute path='customisations' access={3} element={<CompanyCustomisations />}>
              <CompanyRoute path='add' access={3} element={<CustomisationAdd />}/>
              <CompanyRoute path=':id' access={3} element={<Customisation />} />
              <CompanyRoute path=':id/edit' access={3} element={<CustomisationEdit />} />
            </CompanyRoute>

            <CompanyRoute path='menu' element={<MainMenu />} />
            <CompanyRoute path='menu/:id' element={<Menu />} />

            {/* <CompanyRoute path='waiter' element={<Waiter />} /> */}
            <CompanyRoute path='kitchen' element={<Kitchen />} />
            {/* <CompanyRoute path='cashier' element={<Cashier />} /> */}
            {/* <CompanyRoute path='notifications' element={<Menu />} /> */}
          </CompanyRoute>

          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
      <Snackbar />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </Provider>
  );
};

export default App;
