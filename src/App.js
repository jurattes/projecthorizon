import logo from './logo.svg';
import './App.css';
import Registration from './Components/Registration';
import Header from './Components/Header';
import UserPool from './Components/UserPool';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
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
  );
}

export default App;
