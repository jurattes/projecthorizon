import './App.css';
import Registration from './Components/account/Registration';
import Header from './Components/Header';
import Login from './Components/account/Login';
import Settings from './Components/settings/Settings';
import ForgotPassword from './Components/account/ForgotPassword';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AccountSettings } from './Components/settings/AccountSettings';
import { AuthProvider } from './Components/settings/AuthContext';

function App() {
  return (
    <Router>
    <AccountSettings>
      <AuthProvider>
      <div className="App">
      <header className="App-header">
        
      </header>
      <div className = "content">
      <Switch>
        <Route path = "/register"> <Registration /> </Route>
        <Route path = "/settings"> <Settings /> </Route>
        <Route path = "/login"> <Login /> </Route>
        <Route path = "/forgotpassword"> <ForgotPassword /> </Route>
      </Switch>
      </div>
    </div>
      </AuthProvider>
    </AccountSettings>
    </Router>
  );
}

export default App;
