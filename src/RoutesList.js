import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import LoginForm from './LoginSignup/LoginForm'
import SignupForm from './LoginSignup/SignupForm'

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

function RoutesList({ signUp, login, auth }) {
  if (!auth){
    return (
      <Routes>
        <Route path="/login" element={ <LoginForm login={login}/>}/>
        <Route path="/signup" element={ <SignupForm signUp={signUp}/>}/>
        <Route path="/" element={ <Homepage />}/>
        <Route path="*" element={ <Navigate to="/" />}/>
      </Routes>
    )
  }

}


export default RoutesList;