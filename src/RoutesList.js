import CustomerList from './components/LoggedIn/CustomerList';
import ProductList from './components/LoggedIn/ProductList';
import userContext from './userContext';
import InviApi from './api';
import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/LoggedOut/Homepage/Homepage';
import LoginForm from './components/LoggedOut/LoginSignup/LoginForm';
import SignupForm from './components/LoggedOut/LoginSignup/SignupForm';
import Dashboard from './components/LoggedIn/Dashboard';
import { useState, useEffect, useContext } from "react";
import useCustomers from './hooks/useCustomers';
import useProducts from './hooks/useProducts'
import { jwtDecode } from 'jwt-decode';


/** Define routes.
 *
 * Props:
 *  - signUp fn
 *  - login fn
 *  - auth: token
 *
 * State: none
 *
 * App -> RoutesList -> { Homepage }
 */

function RoutesList({ signUp, login, logout, auth }) {
  const { username } = useContext(userContext);
  const { customers, handleFetchCustomers } = useCustomers(username);
  const { products, handleFetchProducts } = useProducts(username);


  if (!auth) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm login={login} />} />
        <Route path="/signup" element={<SignupForm signUp={signUp} />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  else {
    return (
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard logout={logout} />}>
          <Route path="customers" element={<CustomerList listData={customers} onFetchCustomers={handleFetchCustomers} />} />
          <Route path="inventory" element={<ProductList listData={products} onFetchProducts={handleFetchProducts}/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

}


export default RoutesList;