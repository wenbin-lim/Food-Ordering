import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Link,
} from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Auth components
import PrivateRoute from './routing/PrivateRoute';
import WawayaRoute from './routing/WawayaRoute';
import CustomerRoute from './routing/CustomerRoute';

// Components
import Snackbar from './components/layout/Snackbar';

// Wawaya Main Pages
import MainAppWrapper from './routes/main/MainAppWrapper';
import Landing from './routes/main/Landing';
import About from './routes/main/About';
import Login from './routes/main/Login';
import Contact from './routes/main/Contact';
import OrderNow from './routes/ordernow/OrderNow';

// Order Now Pages
import CompanyOrderNow from './routes/customer/CustomerTakeaway';

// Company/Main App Pages
import CompanyAppWrapper from './routes/company/CompanyAppWrapper';
import CompanyLanding from './routes/company/CompanyLanding';
import Dashboard from './routes/company/admin/Dashboard';
import Menu from './routes/company/menu/Menu';
import Notifications from './routes/company/notifications/Notifications';
import Bills from './routes/company/bills/Bills';
import Orders from './routes/company/orders/Orders';
import Tables from './routes/company/tables/Tables';

// Customer App Pages
import CustomerAppWrapper from './routes/customer/CustomerAppWrapper';
import CustomerTakeaway from './routes/customer/CustomerTakeaway';
import CustomerLanding from './routes/customer/CustomerLanding';
// import CustomerCart from './routes/customer/CustomerCart';

// Wawaya Master Pages
import WawayaAppWrapper from './routes/wawaya/WawayaAppWrapper';
import WawayaDashboard from './routes/wawaya/WawayaDashboard';
import Companies from './routes/wawaya/companies/Companies';
import CompanyInfo from './routes/wawaya/companies/CompanyInfo';
import CompanyAdd from './routes/wawaya/companies/CompanyAdd';
import CompanyEdit from './routes/wawaya/companies/CompanyEdit';

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
      store.dispatch(updateScreenOrientation());
    });

    // store
    // populate list of companies in app level app state
    store.dispatch(getCompaniesPublic());

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

          <CustomerRoute
            path='ordernow/:companyName'
            component={CustomerAppWrapper}
          >
            <CustomerRoute path='' component={CustomerTakeaway} />
            <CustomerRoute path='table' minAccessLevel={1} component={Outlet}>
              <CustomerRoute path='' component={CustomerLanding} />
              <CustomerRoute path='menu' component={Menu} />
            </CustomerRoute>
          </CustomerRoute>

          <PrivateRoute path='/:companyName' component={CompanyAppWrapper}>
            <PrivateRoute path='' access={1} component={CompanyLanding} />
            {/* <PrivateRoute path='admin' access={2} component={Dashboard} />
            <PrivateRoute path='menu' access={1} component={Menu} />
            <PrivateRoute
              path='notifications'
              access={1}
              component={Notifications}
            />
            <PrivateRoute path='bills' access={1} component={Bills} />
            <PrivateRoute path='orders' access={1} component={Orders} />
            <PrivateRoute path='tables' access={1} component={Tables} />
            <PrivateRoute path='table' component={CustomerAppWrapper}>
              <PrivateRoute path='menu' component={Menu} />
              <PrivateRoute path='cart' component={Cart} />
            </PrivateRoute> */}
          </PrivateRoute>

          <WawayaRoute path='/wawaya' component={WawayaAppWrapper}>
            <WawayaRoute path='' component={WawayaDashboard} />

            <WawayaRoute path='companies' component={Companies}>
              <WawayaRoute path='add' component={CompanyAdd} />
              <WawayaRoute path=':id' component={CompanyInfo} />
              <WawayaRoute path=':id/edit' component={CompanyEdit} />
            </WawayaRoute>
          </WawayaRoute>
        </Routes>
      </Router>
      <Snackbar />
    </Provider>
  );
};

export default App;
