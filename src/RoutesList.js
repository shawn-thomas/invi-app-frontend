import { useState, useEffect, useContext } from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import userContext from './userContext';
import Homepage from './components/LoggedOut/Homepage/Homepage';
import LoginForm from './components/LoggedOut/LoginSignup/LoginForm';
import SignupForm from './components/LoggedOut/LoginSignup/SignupForm';
import Dashboard from './components/LoggedIn/Dashboard/Dashboard';
import CustomerList from './components/LoggedIn/Lists/CustomerList';
import ProductList from './components/LoggedIn/Lists/ProductList';
import AuditListWithLocalizationProvider from "./components/LoggedIn/Lists/AuditList";
import InvoiceListWithLocalizationProvider from "./components/LoggedIn/Lists/InvoiceList";
import InvoiceForm from "./components/LoggedIn/Invoice/InvoiceForm";
import useCustomers from './hooks/useCustomers';
import useProducts from './hooks/useProducts';
import useInvoices from './hooks/useInvoices';
import useAudits from "./hooks/useAudits";

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

function RoutesList({ currentUser, signUp, login, logout }) {
  const username = currentUser?.username;
  const { customers, handleFetchCustomers } = useCustomers(username || '');
  const { products, handleFetchProducts } = useProducts(username || '');
  const { invoices, invoiceNbr, handleFetchInvoices } = useInvoices(username || '');
  const { auditRecords, handleFetchRecords } = useAudits(username || '');

  return (
    <Routes>
      {!currentUser &&
        <>
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signUp={signUp} />} />
          <Route path="/" element={<Homepage />} />
        </>
      }

      {currentUser &&
        <>
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
                  onFetchAudit={handleFetchRecords}
                />
              }
            />
            <Route
              path="/dashboard/invoices"
              element={
                <InvoiceListWithLocalizationProvider
                  listData={invoices}
                  onFetchInvoices={handleFetchInvoices}
                  onFetchAudit={handleFetchRecords}
                />
              }
            />
            <Route
              path="/dashboard/invoices/create"
              element={
                <InvoiceForm
                  user={currentUser}
                  customers={customers}
                  products={products}
                  currentInvoiceNbr={invoiceNbr}
                  onFetchInvoices={handleFetchInvoices}
                  onFetchProducts={handleFetchProducts}
                  onFetchCustomers={handleFetchCustomers}
                />
              }
            />
            <Route
              path="/dashboard/audit"
              element={
                <AuditListWithLocalizationProvider
                  listData={auditRecords} />
              }
            />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/" />}/>
        </>
      }
    </Routes>
  );
}


export default RoutesList;