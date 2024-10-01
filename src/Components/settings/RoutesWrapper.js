import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AccountSettings } from './AccountSettings'; // Adjust the path as needed
import {AuthContext} from './AuthContext'; // Adjust the path as needed
import Registration from '../account/Registration'; // Adjust the path as needed
import Settings from './Settings'; // Adjust the path as needed
import Login from '../account/Login'; // Adjust the path as needed
import ForgotPassword from '../account/ForgotPassword'; // Adjust the path as needed

const RoutesWrapper = () => {
  return (
    <Router>
      <AccountSettings>
        <AuthContext>
              <Switch>
                <Route path="/register" component={Registration} />
                <Route path="/settings" component={Settings} />
                <Route path="/login" component={Login} />
                <Route path="/forgotpassword" component={ForgotPassword} />
              </Switch>
        </AuthContext>
      </AccountSettings>
    </Router>
  );
};

export default RoutesWrapper;
