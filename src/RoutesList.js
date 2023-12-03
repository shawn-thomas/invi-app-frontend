import { useState, useEffect, useContext } from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import userContext from './userContext';
import Homepage from './components/LoggedOut/Homepage/Homepage';
import LoginForm from './components/LoggedOut/LoginSignup/LoginForm';
import SignupForm from './components/LoggedOut/LoginSignup/SignupForm';
import Dashboard from './components/LoggedIn/Dashboard/Dashboard';
import CustomerList from './components/LoggedIn/Lists/CustomerList';
import ProductList from './components/LoggedIn/Lists/ProductList';
import InvoiceForm from "./components/LoggedIn/Invoice/InvoiceForm";
import useCustomers from './hooks/useCustomers';
import useProducts from './hooks/useProducts';

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

function RoutesList({ signUp, login, logout }) {
  const userData = useContext(userContext);
  const { currentUser } = userData;
  const username = currentUser?.username;
  const [loading, setLoading] = useState(true);

  const { customers, handleFetchCustomers } = useCustomers(username || '');
  const { products, handleFetchProducts } = useProducts(username || '');

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <Dashboard logout={logout} />;
  }

  console.log('Navigating to /' + (currentUser ? 'dashboard' : ''));


  if (!currentUser) {
    console.log('Navigating to /');
    return (
      <Routes>
        <Route path="/login" element={<LoginForm login={login} />} />
        <Route path="/signup" element={<SignupForm signUp={signUp} />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    console.log('Navigating to /dashboard');
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard logout={logout} />}>
          <Route
            path="/dashboard/customers"
            element={
              <CustomerList
                listData={customers}
                onFetchCustomers={handleFetchCustomers}
              />
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <ProductList
                listData={products}
                onFetchProducts={handleFetchProducts}
              />
            }
          />
          <Route
            path="/dashboard/invoice"
            element={
              <InvoiceForm
                user={currentUser}
                customers={customers}
                products={products}
                onFetchproducts={handleFetchProducts}
                onFetchCustomers={handleFetchCustomers}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }

}


export default RoutesList;