import React, { useEffect } from 'react';
import './App.css';

// Router
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Landing Page
import Landing from './components/layout/Landing';

// Auth components
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/routing/PrivateRoute';

// Components
import Snackbar from './components/layout/Snackbar';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';

// Icons
import CartIcon from './components/icons/CartIcon';
import BellIcon from './components/icons/BellIcon';

// Users
import Users from './components/users/Users';
import UserInfo from './components/users/UserInfo';
import UserEdit from './components/users/UserEdit';

// Actions
import { loadUser } from './actions/auth';
import { loadApp, updateScreenOrientation } from './actions/layout';

const App = () => {
  useEffect(() => {
    store.dispatch(loadApp());
    store.dispatch(loadUser());

    /* 
      Set the relevant css styles
    */
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
    // window.addEventListener('orientationchange', setVhProperty);

    /* Screen Orientation */
    window.addEventListener('orientationchange', () => {
      store.dispatch(updateScreenOrientation());
    });

    // eslint-disable-next-line
  }, []);

  const bottomNavItems = [
    {
      icon: <CartIcon />,
      desc: 'cart',
      path: '/login',
    },
    {
      icon: <BellIcon />,
      desc: 'bell',
      path: '/register',
    },
    {
      desc: 'bell',
      path: '/register',
    },
    {
      icon: <BellIcon />,
      path: '/register',
    },
    {
      icon: <BellIcon />,
      desc: 'bell',
      path: '/register',
    },
    {
      icon: <BellIcon />,
      desc: 'bell',
      path: '/register',
    },
  ];

  return (
    <Provider store={store}>
      <Router>
        <div className='app-wrapper'>
          <Navbar showLogoutButton={true} />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <PrivateRoute path='/users' component={Users}>
              <Route path=':id' element={<UserInfo />} />
              <Route path=':id/edit' element={<UserEdit />} />
            </PrivateRoute>
          </Routes>
          {/* <BottomNav navItems={bottomNavItems} /> */}
        </div>
        <Snackbar />
      </Router>
    </Provider>
  );
};

export default App;
