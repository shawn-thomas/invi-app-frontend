// import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RoutesList from './RoutesList';
import Homepage from './Homepage/Homepage';
import InviApi from './api';
import { jwtDecode } from "jwt-decode";
import userContext from './userContext';

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

  const [token, setToken] = useState("");

  /** Register a new user and update token */
  async function signUp(newUserData) {
    try {
      await InviApi.register(newUserData);
      setToken(InviApi.token);
    } catch (err) {
      alert(err);
    }
  }

  /** Login an existing user and update token */
  async function login(userData) {
    try {
      await InviApi.login(userData);
      setToken(InviApi.token);
      localStorage.setItem('token', JSON.stringify(InviApi.token));
    } catch (err) {
      alert(err);
    }
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
