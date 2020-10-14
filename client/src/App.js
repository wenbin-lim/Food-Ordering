import React, { useEffect } from 'react';
import axios from 'axios';
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
import OrderNow from './routes/ordernow/OrderNow';

// Customer App Pages
import CustomerAppWrapper from './routes/customer/CustomerAppWrapper';
import CustomerTakeaway from './routes/customer/CustomerTakeaway';
import CustomerLanding from './routes/customer/CustomerLanding';
import Cart from './routes/customer/Cart';

// Company/Main App Pages
import CompanyAppWrapper from './routes/company/CompanyAppWrapper';
import CompanyLanding from './routes/company/CompanyLanding';
import Dashboard from './routes/company/admin/Dashboard';
import Menu from './components/menu/Menu';
import Notifications from './routes/company/notifications/Notifications';
import Bills from './routes/company/bills/Bills';
import Orders from './routes/company/orders/Orders';
import Tables from './routes/company/tables/Tables';

// Wawaya Master Pages
import WawayaAppWrapper from './routes/wawaya/WawayaAppWrapper';
import WawayaDashboard from './routes/wawaya/WawayaDashboard';
import Companies from './routes/wawaya/companies/Companies';
import CompanyInfo from './routes/wawaya/companies/CompanyInfo';
import CompanyAdd from './routes/wawaya/companies/CompanyAdd';
import CompanyEdit from './routes/wawaya/companies/CompanyEdit';
import Users from './routes/wawaya/users/Users';
import UserAdd from './components/users/UserAdd';
import UserInfo from './components/users/UserInfo';
import UserEdit from './components/users/UserEdit';

// Actions
import { getCompaniesPublic, updateScreenOrientation } from './actions/app';

const App = () => {
  useEffect(() => {
    /*  Set the relevant css styles */
    const setVhProperty = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight / 100}px`
      );
    };

    // init
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('scroll', setVhProperty);

    /* Screen Orientation */
    window.addEventListener('orientationchange', () => {
      setVhProperty();
      store.dispatch(updateScreenOrientation());
    });

    // store
    // populate list of companies in app level app state for route population
    store.dispatch(getCompaniesPublic());

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
          </Route>

          <CustomerRoute
            path='ordernow/:companyName'
            component={CustomerAppWrapper}
          >
            <CustomerRoute path='' component={CustomerTakeaway} />
            <CustomerRoute path='table' minAccessLevel={1} component={Outlet}>
              <CustomerRoute path='' component={CustomerLanding} />
              <CustomerRoute path='menu' component={Menu} />
              <CustomerRoute path='cart' component={Cart} />
            </CustomerRoute>
          </CustomerRoute>

          <CompanyRoute path='/:companyName' component={CompanyAppWrapper}>
            <CompanyRoute path='' component={CompanyLanding} />
            <CompanyRoute path='menu' component={Menu} />
            <CompanyRoute path='admin' access={3} component={Dashboard} />
            <CompanyRoute
              path='notifications'
              access={1}
              component={Notifications}
            />
            <CompanyRoute path='tables' component={Tables} />
            <CompanyRoute path='orders' component={Orders} />
            <CompanyRoute path='bills' component={Bills} />
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
          </WawayaRoute>
        </Routes>
      </Router>
      <Snackbar />
    </Provider>
  );
};

export default App;
