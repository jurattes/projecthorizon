import './App.css';
import Registration from './Components/Registration';
import Header from './Components/Header';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AccountSettings } from './Components/AccountSettings';

function App() {
  return (
    <AccountSettings>
      <Router>
      <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className = "content">
      <Switch>
        <Route path = "/register">
          <Registration />
        </Route>
        <Route path = "/login">
          <Login />
        </Route>
      </Switch>
      </div>
    </div>
    </Router>
    </AccountSettings>
  );
}

export default App;
