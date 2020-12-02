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

// App wrappers
import MainAppWrapper from './components/wrappers/MainAppWrapper';
import WawayaAppWrapper from './components/wrappers/WawayaAppWrapper';
import CompanyAppWrapper from './components/wrappers/CompanyAppWrapper';
import CustomerAppWrapper from './components/wrappers/CustomerAppWrapper';

// Landing Pages
import Landing from './components/landing/Landing';
import WawayaDashboard from './components/landing/WawayaDashboard';
import CompanyLanding from './components/landing/CompanyLanding';
import CustomerLanding from './components/landing/CustomerLanding';

// Main Pages
import About from './components/main/About';
import Contact from './components/main/Contact';

// Login Pages
import Login from './components/login/Login';
import CustomerLogin from './components/login/CustomerLogin';

// Model Components
import Companies from './components/companies/Companies';
import CompanyInfo from './components/companies/CompanyInfo';
import CompanyAdd from './components/companies/CompanyAdd';
import CompanyEdit from './components/companies/CompanyEdit';

import Users from './components/users/Users';
import UserAdd from './components/users/UserAdd';
import UserInfo from './components/users/UserInfo';
import UserEdit from './components/users/UserEdit';

import Tables from './components/tables/Tables';
import TableAdd from './components/tables/TableAdd';
import TableInfo from './components/tables/TableInfo';
import TableEdit from './components/tables/TableEdit';

import Menus from './components/menus/Menus';
import MenuAdd from './components/menus/MenuAdd';
import MenuInfo from './components/menus/MenuInfo';
import MenuEdit from './components/menus/MenuEdit';

import Foods from './components/foods/Foods';
import FoodAdd from './components/foods/FoodAdd';
import FoodInfo from './components/foods/FoodInfo';
import FoodEdit from './components/foods/FoodEdit';

import Customisations from './components/customisations/Customisations';
import CustomisationAdd from './components/customisations/CustomisationAdd';
import CustomisationInfo from './components/customisations/CustomisationInfo';
import CustomisationEdit from './components/customisations/CustomisationEdit';

import Bills from './components/bills/Bills';
import BillInfo from './components/bills/BillInfo';
import BillEdit from './components/bills/BillEdit';

import Discounts from './components/discounts/Discounts';
import DiscountAdd from './components/discounts/DiscountAdd';
import DiscountInfo from './components/discounts/DiscountInfo';
import DiscountEdit from './components/discounts/DiscountEdit';

// Company Components
import MainMenu from './components/menus/MainMenu';
import Menu from './components/menus/Menu';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminSettings from './components/admin/AdminSettings';

import Kitchen from './components/kitchen/Kitchen';
import Waiter from './components/waiter/Waiter';
import Cashier from './components/cashier/Cashier';

import Notifications from './components/notifications/Notifications';

// Customer Components
import Cart from './components/customer/Cart';

// Functions
import { updateScreenOrientation } from './actions/app';
import { loadToken } from './actions/auth';

const App = () => {
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
              <WawayaRoute path=':id' element={<CompanyInfo />} />
              <WawayaRoute path=':id/edit' element={<CompanyEdit />} />
            </WawayaRoute>

            <WawayaRoute path='users' element={<Users />}>
              <WawayaRoute path='add' element={<UserAdd />} />
              <WawayaRoute path=':id' element={<UserInfo />} />
              <WawayaRoute path=':id/edit' element={<UserEdit />} />
            </WawayaRoute>

            <WawayaRoute path='tables' element={<Tables />}>
              <WawayaRoute path='add' element={<TableAdd />} />
              <WawayaRoute path=':id' element={<TableInfo />} />
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
              <WawayaRoute path=':id' element={<CustomisationInfo />} />
              <WawayaRoute path=':id/edit' element={<CustomisationEdit />} />
            </WawayaRoute>

            <WawayaRoute path='bills' element={<Bills />}>
              <WawayaRoute path=':id' element={<BillInfo />} />
              <WawayaRoute path=':id/edit' element={<BillEdit />} />
            </WawayaRoute>

            <WawayaRoute path='discounts' element={<Discounts />}>
              <WawayaRoute path='add' element={<DiscountAdd />} />
              <WawayaRoute path=':id' element={<DiscountInfo />} />
              <WawayaRoute path=':id/edit' element={<DiscountEdit />} />
            </WawayaRoute>
          </WawayaRoute>

          <CompanyRoute path='/:companyName' element={<CompanyAppWrapper />}>
            <CompanyRoute path='/' element={<CompanyLanding />} />

            {/* prettier-ignore */}
            <CompanyRoute path='admin' access={3} element={<AdminDashboard />} />

            <CompanyRoute
              path='settings'
              access={3}
              element={<AdminSettings />}
            />

            <CompanyRoute path='users' access={3} element={<Users />}>
              <CompanyRoute path='add' access={3} element={<UserAdd />} />
              <CompanyRoute path=':id' access={3} element={<UserInfo />} />
              <CompanyRoute path=':id/edit' access={3} element={<UserEdit />} />
            </CompanyRoute>

            <CompanyRoute path='tables' access={3} element={<Tables />}>
              <CompanyRoute path='add' access={3} element={<TableAdd />} />
              <CompanyRoute path=':id' access={3} element={<TableInfo />} />
              {/* prettier-ignore */}
              <CompanyRoute path=':id/edit' access={3} element={<TableEdit />} />
            </CompanyRoute>

            <CompanyRoute path='menus' access={3} element={<Menus />}>
              <CompanyRoute path='add' access={3} element={<MenuAdd />} />
              <CompanyRoute path=':id' access={3} element={<MenuInfo />} />
              <CompanyRoute path=':id/edit' access={3} element={<MenuEdit />} />
            </CompanyRoute>

            <CompanyRoute path='foods' element={<Foods />}>
              <CompanyRoute path='add' access={3} element={<FoodAdd />} />
              <CompanyRoute path=':id' element={<FoodInfo />} />
              <CompanyRoute path=':id/edit' element={<FoodEdit />} />
            </CompanyRoute>

            {/* prettier-ignore */}
            <CompanyRoute path='customisations' element={<Customisations />}>
              <CompanyRoute path='add' access={3} element={<CustomisationAdd />}/>
              <CompanyRoute path=':id' element={<CustomisationInfo />} />
              <CompanyRoute path=':id/edit' element={<CustomisationEdit />} />
            </CompanyRoute>

            <CompanyRoute path='bills' element={<Bills />}>
              <CompanyRoute path=':id' element={<BillInfo />} />
              <CompanyRoute path=':id/edit' access={3} element={<BillEdit />} />
            </CompanyRoute>

            <CompanyRoute path='discounts' element={<Discounts />}>
              <CompanyRoute path='add' access={3} element={<DiscountAdd />} />
              <CompanyRoute path=':id' element={<DiscountInfo />} />
              <CompanyRoute path=':id/edit' element={<DiscountEdit />} />
            </CompanyRoute>

            <CompanyRoute path='menu' element={<MainMenu />} />
            <CompanyRoute path='menu/:id' element={<Menu />} />

            <CompanyRoute path='waiter' element={<Waiter />}>
              <CompanyRoute path=':id' element={<BillEdit />} />
            </CompanyRoute>

            <CompanyRoute path='kitchen' element={<Kitchen />} />

            <CompanyRoute path='cashier' element={<Cashier />}>
              <CompanyRoute path=':id' element={<BillEdit />} />
            </CompanyRoute>

            <CompanyRoute path='notifications' element={<Notifications />} />
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
