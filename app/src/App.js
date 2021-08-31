import React from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Private from './Private';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
      <div className="App">
        <div className="page">
          <div className="content">
            <BrowserRouter>
              <Header/>
              <Route path='/' exact={true} component={Home}/>
              <Route path='/private' exact={true} component={Private}/>
            </BrowserRouter>
          </div>
        </div>
      </div>
  );
}

export default App;
