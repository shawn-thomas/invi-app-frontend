// import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

import userContext from './userContext';
import RoutesList from './RoutesList';
import useLocalStorage from "./hooks/useLocalStorage";
import Homepage from './components/LoggedOut/Homepage/Homepage'
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

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  // const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [token, setToken] = useState("");

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
  }

  useEffect(function fetchUserWhenMountedOrTokenChange() {
    async function fetchUser() {
      if (token) {
        const payload = jwtDecode(token);
        let username = payload.username;
        try {
          const userRes = await InviApi.getUser(username); // userData
          setUser(userRes);
        } catch (err) {
          console.warn(err);
        }
      } else {
        setUser({
          username: "",
          firstName: "",
          lastName: "",
          email: ""
        });
      }
    }
    fetchUser();
  }, [token]);

  return (
    <div className="App">
      <userContext.Provider value={{
        username: user.username,
        firstName: user.firstName
      }}>
        <BrowserRouter>

          <RoutesList
            signUp={signUp}
            login={login}
            auth={token} />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
