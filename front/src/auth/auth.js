import * as React from "react";
import {useLocation, Navigate} from 'react-router-dom'

let AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  let [user, setUser] = React.useState(null);

  let signin = (callback) => {
    return new Promise((res)=>{
      setUser('OK');
      res();
      callback();
    })
  };

  let signout = (callback) => {
    return new Promise((res)=>{
      setUser(null);
      res();
      callback();
    })
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export {RequireAuth, AuthProvider, useAuth}