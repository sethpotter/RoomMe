import './App.css';
import {
  Route, BrowserRouter, Switch
} from 'react-router-dom';
import Landing from './Pages/Landing';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import SwipingPage from './Pages/Swiping';
import ProfilePage from './Pages/Profile';
import MessagingPage from './Pages/Messaging';
import PrivateRoute from './utils/PrivateRoute';
import InitialSetupPage from './Pages/InitialSetup';
import { EditProfile } from './Pages/EditProfile';
import SettingsPage from './Pages/Settings';

// React functional component
function App () {
  return (
    <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <PrivateRoute path="/accountSetup">
          <InitialSetupPage />
        </PrivateRoute>
        <PrivateRoute path="/home">
          <SwipingPage />
        </PrivateRoute>
        <PrivateRoute path="/profile">
          <ProfilePage profile/>
        </PrivateRoute>
        <PrivateRoute path="/profileEdit">
          <EditProfile/>
        </PrivateRoute>
        <PrivateRoute path="/messaging">
          <MessagingPage />
        </PrivateRoute>
        <PrivateRoute path="/settings">
          <SettingsPage />
        </PrivateRoute>
        
      </Switch>
    </BrowserRouter>
  </>
  );
}


export default App;
