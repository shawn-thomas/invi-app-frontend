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
    data: {
      username: "",
      firstName: "",
      lastName: "",
      email: ""
    },
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
    setToken("");
    InviApi.token = "";
    setCurrentUser({
      infoLoaded: false,
      data: {
        username: "",
        firstName: "",
        lastName: "",
        email: ""
      }
    });
  }

  useEffect(function fetchUserWhenMountedOrTokenChange() {
    async function fetchUser() {
      if (token) {
        try {
          let payload = jwtDecode(token);
          let username = payload.username;
          const userRes = await InviApi.getUser(username); // userData
          setCurrentUser({
            infoLoaded: true,
            data: userRes
          });
        } catch (err) {
          console.warn(err);
          setCurrentUser({
            infoLoaded: false,
            data: {
              username: "",
              firstName: "",
              lastName: "",
              email: ""
            }
          });
        }
      } else {
        setCurrentUser({
          infoLoaded: false,
          data: {
            username: "",
            firstName: "",
            lastName: "",
            email: ""
          }
        });
      }
    }
    fetchUser();
  }, [token]);

  return (
    <div className="App">
      <userContext.Provider value={{
        username: currentUser.data.username,
        firstName: currentUser.data.firstName
      }}>
        <BrowserRouter>

          <RoutesList
            signUp={signUp}
            login={login}
            logout={logout}
            auth={token}
          />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
