import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './Components/Registration';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path = "/register">
          <Registration />
          </Route>
        </Routes>
      </header>
    </div>
    </BrowserRouter>
  );
}

export default App;
