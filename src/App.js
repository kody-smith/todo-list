import logo from './logo.svg';
import './App.css';
import Welcome from './components/Welcome.js'
import Homepage from './components/homepage.js'
import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />}/>
          <Route path="/homepage" element={<Homepage />}/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;
