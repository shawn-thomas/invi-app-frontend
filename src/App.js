// import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

import userContext from './userContext';
import RoutesList from './RoutesList';
import useLocalStorage from "./hooks/useLocalStorage";
import InviApi from './api';

// Key name for storing token in localStorage for "remember me" re-login
const TOKEN_STORAGE_ID = "invi-token";

/** App
 *
 * State:
 * - user, like { username, firstName, lastName, email}
 * - token
 *
 * App -> RoutesList
 */

function App() {
  const [currentUser, setCurrentUser] = useState({
    data: null,
    infoLoaded: false,
  });

  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID, "");

  /** Register a new user and update token */
  async function signUp(signupData) {
    let token = await InviApi.register(signupData);
    setToken(token);
  }

  /** Login an existing user and update token */
  async function login(userData) {
    let token = await InviApi.login(userData);
    setToken(token);
  }

  /** Logout user, update token to empty string */
  function logout() {
    setCurrentUser({
      infoLoaded: true,
      data: null
    });
    setToken(null);
  }

  useEffect(function fetchUserWhenMountedOrTokenChange() {
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          InviApi.token = token;
          let currentUser = await InviApi.getUser(username);
          setCurrentUser({
            infoLoaded: true,
            data: currentUser
          });
        } catch (err) {
          console.warn(err);
          setCurrentUser({
            infoLoaded: false,
            data: null
          });
        }
      } else {
        setCurrentUser({
          infoLoaded: false,
          data: null
        });
      }
    }
    getCurrentUser();
  }, [token]);

  return (
    <div className="App">
      <userContext.Provider value={{
        currentUser: currentUser.data,
        setCurrentUser
      }}>
        <BrowserRouter>

          <RoutesList
            currentUser={currentUser.data}
            signUp={signUp}
            login={login}
            logout={logout}
          />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
