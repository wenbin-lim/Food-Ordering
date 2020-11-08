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

// Auth components
import WawayaRoute from './routing/WawayaRoute';
import CustomerRoute from './routing/CustomerRoute';
import CompanyRoute from './routing/CompanyRoute';

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
import CustomerTakeaway from './routes/customer/CustomerTakeaway';
import CustomerLanding from './routes/customer/CustomerLanding';

// Company/Main App Pages
import CompanyAppWrapper from './routes/company/CompanyAppWrapper';
import CompanyLanding from './routes/company/CompanyLanding';
import Dashboard from './routes/company/admin/Dashboard';

import CompanyUsers from './routes/company/users/CompanyUsers';
import CompanyTables from './routes/company/tables/CompanyTables';
import CompanyMenus from './routes/company/menus/CompanyMenus';
import CompanyFoods from './routes/company/foods/CompanyFoods';
import CompanyCustomisations from './routes/company/customisations/CompanyCustomisations';

import MainMenu from './components/menus/MainMenu';
import Menu from './components/menus/Menu';
import Notifications from './routes/company/notifications/Notifications';
import Bills from './routes/company/bills/Bills';
import Orders from './routes/company/orders/Orders';
// import Tables from './routes/company/tables/Tables';

// Wawaya Master Pages
import WawayaAppWrapper from './routes/wawaya/WawayaAppWrapper';
import WawayaDashboard from './routes/wawaya/WawayaDashboard';
import Companies from './routes/wawaya/companies/Companies';
import CompanyInfo from './routes/wawaya/companies/CompanyInfo';
import CompanyAdd from './routes/wawaya/companies/CompanyAdd';
import CompanyEdit from './routes/wawaya/companies/CompanyEdit';
import Users from './routes/wawaya/users/Users';
import Tables from './routes/wawaya/tables/Tables';
import Menus from './routes/wawaya/menus/Menus';
import Foods from './routes/wawaya/foods/Foods';
import Customisations from './routes/wawaya/foods/Customisations';

// Reused Components
import UserAdd from './components/users/UserAdd';
import UserInfo from './components/users/UserInfo';
import UserEdit from './components/users/UserEdit';

import TableAdd from './components/tables/TableAdd';
import TableInfo from './components/tables/TableInfo';
import TableEdit from './components/tables/TableEdit';

import MenuAdd from './components/menus/MenuAdd';
import MenuInfo from './components/menus/MenuInfo';
import MenuEdit from './components/menus/MenuEdit';

import CustomisationAdd from './components/customisations/CustomisationAdd';
import CustomisationInfo from './components/customisations/CustomisationInfo';
import CustomisationEdit from './components/customisations/CustomisationEdit';

import FoodAdd from './components/foods/FoodAdd';
import FoodInfo from './components/foods/FoodInfo';
import FoodEdit from './components/foods/FoodEdit';

// Actions
import { getCompaniesPublic, updateScreenOrientation } from './actions/app';
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
    // populate list of companies in app level app state for route population
    store.dispatch(getCompaniesPublic());
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
          <Route path='*' element={<Navigate to='/' />} />

          <Route path='/' element={<MainAppWrapper />}>
            <Route path='' element={<Landing />} />
            <Route path='login' element={<Login />} />
            <Route path='about' element={<About />} />
            <Route path='contact' element={<Contact />} />
            <Route
              path='takeaway/:companyName'
              element={<CustomerTakeaway />}
            />
          </Route>

          <Route path='dinein' element={<CustomerLogin />} />

          <CustomerRoute
            path='dinein/:companyName'
            component={CustomerAppWrapper}
          >
            <CustomerRoute path='' component={CustomerLanding} />
            <CustomerRoute path='menu' component={MainMenu} />
            <CustomerRoute path='menu/:id' component={Menu} />
          </CustomerRoute>

          <CompanyRoute path='/:companyName' component={CompanyAppWrapper}>
            <CompanyRoute path='' component={CompanyLanding} />

            <CompanyRoute path='admin' minAccess={3} component={Dashboard} />

            <CompanyRoute path='users' minAccess={3} component={CompanyUsers}>
              <CompanyRoute path='add' minAccess={3} component={UserAdd} />
              <CompanyRoute path=':id' minAccess={3} component={UserInfo} />
              <CompanyRoute
                path=':id/edit'
                minAccess={3}
                component={UserEdit}
              />
            </CompanyRoute>

            <CompanyRoute path='tables' minAccess={3} component={CompanyTables}>
              <CompanyRoute path='add' minAccess={3} component={TableAdd} />
              <CompanyRoute path=':id' minAccess={3} component={TableInfo} />
              <CompanyRoute
                path=':id/edit'
                minAccess={3}
                component={TableEdit}
              />
            </CompanyRoute>

            <CompanyRoute path='menus' minAccess={3} component={CompanyMenus}>
              <CompanyRoute path='add' minAccess={3} component={MenuAdd} />
              <CompanyRoute path=':id' minAccess={3} component={MenuInfo} />
              <CompanyRoute
                path=':id/edit'
                minAccess={3}
                component={MenuEdit}
              />
            </CompanyRoute>

            <CompanyRoute path='foods' minAccess={3} component={CompanyFoods}>
              <CompanyRoute path='add' minAccess={3} component={FoodAdd} />
              <CompanyRoute path=':id' minAccess={3} component={FoodInfo} />
              <CompanyRoute
                path=':id/edit'
                minAccess={3}
                component={FoodEdit}
              />
            </CompanyRoute>

            <CompanyRoute
              path='customisations'
              minAccess={3}
              component={CompanyCustomisations}
            >
              <CompanyRoute
                path='add'
                minAccess={3}
                component={CustomisationAdd}
              />
              <CompanyRoute
                path=':id'
                minAccess={3}
                component={CustomisationInfo}
              />
              <CompanyRoute
                path=':id/edit'
                minAccess={3}
                component={CustomisationEdit}
              />
            </CompanyRoute>

            <CompanyRoute path='menu' component={Outlet}>
              <CompanyRoute path='' component={MainMenu} />
              <CompanyRoute path=':id' component={Menu} />
            </CompanyRoute>

            {/* <CompanyRoute path='tables' component={Tables} /> */}
            <CompanyRoute path='orders' component={Orders} />
            <CompanyRoute path='bills' component={Bills} />
            <CompanyRoute path='notifications' component={Notifications} />
          </CompanyRoute>

          <WawayaRoute path='/wawaya' component={WawayaAppWrapper}>
            <WawayaRoute path='' component={WawayaDashboard} />

            <WawayaRoute path='companies' component={Companies}>
              <WawayaRoute path='add' component={CompanyAdd} />
              <WawayaRoute path=':id' component={CompanyInfo} />
              <WawayaRoute path=':id/edit' component={CompanyEdit} />
            </WawayaRoute>

            <WawayaRoute path='users' component={Users}>
              <WawayaRoute path='add' component={UserAdd} />
              <WawayaRoute path=':id' component={UserInfo} />
              <WawayaRoute path=':id/edit' component={UserEdit} />
            </WawayaRoute>

            <WawayaRoute path='tables' component={Tables}>
              <WawayaRoute path='add' component={TableAdd} />
              <WawayaRoute path=':id' component={TableInfo} />
              <WawayaRoute path=':id/edit' component={TableEdit} />
            </WawayaRoute>

            <WawayaRoute path='menus' component={Menus}>
              <WawayaRoute path='add' component={MenuAdd} />
              <WawayaRoute path=':id' component={MenuInfo} />
              <WawayaRoute path=':id/edit' component={MenuEdit} />
            </WawayaRoute>

            <WawayaRoute path='customisations' component={Customisations}>
              <WawayaRoute path='add' component={CustomisationAdd} />
              <WawayaRoute path=':id' component={CustomisationInfo} />
              <WawayaRoute path=':id/edit' component={CustomisationEdit} />
            </WawayaRoute>

            <WawayaRoute path='foods' component={Foods}>
              <WawayaRoute path='add' component={FoodAdd} />
              <WawayaRoute path=':id' component={FoodInfo} />
              <WawayaRoute path=':id/edit' component={FoodEdit} />
            </WawayaRoute>
          </WawayaRoute>
        </Routes>
      </Router>
      <Snackbar />
    </Provider>
  );
};

export default App;
