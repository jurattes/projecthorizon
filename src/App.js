import './App.css';
import Registration from './Components/Registration';
import Header from './Components/Header';
import Login from './Components/Login';
import Settings from './Components/Settings';
import ForgotPassword from './Components/ForgotPassword';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AccountSettings } from './Components/AccountSettings';
import Status from './Components/Status';

function App() {
  return (
    <AccountSettings>
      <Router>
      <div className="App">
      <header className="App-header">
        
      </header>
      <div className = "content">
      <Switch>
        <Route path = "/register">
          <Registration />
        </Route>
        <Route path = "/settings">
          <Settings />
        </Route>
        <Route path = "/login">
          <Login />
        </Route>
        <Route path = "/forgotpassword">
          <ForgotPassword />
        </Route>
      </Switch>
      </div>
    </div>
    </Router>
    </AccountSettings>
  );
}

export default App;
