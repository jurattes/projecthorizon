import './App.css';
import Registration from './Components/account/Registration';
import Header from './Components/Header';
import Login from './Components/account/Login';
import Settings from './Components/settings/Settings';
import ForgotPassword from './Components/account/ForgotPassword';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AccountSettings } from './Components/settings/AccountSettings';
import { AuthProvider } from './Components/settings/AuthContext';
import { AuctionBody } from './Components/auctions/body';
import { SearchAuctions } from './Components/auctions/search';
import ModeratorPanel  from './Components/mod/ModeratorPanel';

function App() {
  return (
    <Router>
    <AccountSettings>
      <AuthProvider>
      <div className="App">
        <Header />
      <div className = "content">
      <Switch>
        <Route path = "/register"> <Registration /> </Route>
        <Route path = "/settings"> <Settings /> </Route>
        <Route path = "/login"> <Login /> </Route>
        <Route path = "/forgotpassword"> <ForgotPassword /> </Route>
        <Route path = "/search"> <SearchAuctions /> </Route>
        <Route path = "/mod"> <ModeratorPanel /> </Route>
      </Switch>
      <AuctionBody />
      </div>
    </div>
      </AuthProvider>
    </AccountSettings>
    </Router>
  );
}

export default App;
