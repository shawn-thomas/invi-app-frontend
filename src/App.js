import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

import userContext from './userContext';
import RoutesList from './RoutesList';
import useLocalStorage from "./hooks/useLocalStorage";
import InviApi from './api';

/** App
 *
 * App -> RoutesList
 */

function App() {
  const [currentUser, setCurrentUser] = useState({
    data: null,
    infoLoaded: false,
  });

  const [token, setToken] = useLocalStorage(process.env.TOKEN_STORAGE_ID, "");

  /** Register a new user and update token.
   *
   * @param {object} signupData - { username, password, firstname, lastname, email}
  */
  async function signUp(signupData) {
    let token = await InviApi.register(signupData);
    setToken(token);
  }

  /** Login an existing user and update token
   *
   * @param {object} userData - { username, password }
  */
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

  /** Fetch user data when component mounts or token change. */
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
