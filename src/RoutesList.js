import CustomerList from './components/LoggedIn/CustomerList';
import userContext from './userContext';
import InviApi from './api';
import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/LoggedOut/Homepage/Homepage';
import LoginForm from './components/LoggedOut/LoginSignup/LoginForm';
import SignupForm from './components/LoggedOut/LoginSignup/SignupForm';
import Dashboard from './components/LoggedIn/Dashboard';
import { useState, useEffect, useContext } from "react";
import useCustomers from './components/LoggedIn/useCustomers';




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
  const [triggerFetch, setTriggerFetch] = useState(false);
  const customers = useCustomers(username, handleFetchCustomers)

  function handleFetchCustomers() {
    setTriggerFetch((prev) => !prev);
  };

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
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

}


export default RoutesList;