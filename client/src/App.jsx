import React from 'react';
import Home from "./pages/Home";
import SQLPage from "./pages/SQLPage";
import NoSQLPage from "./pages/NoSQLPage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/SQLPage"element={<SQLPage />}/>
        <Route path="/NoSQLPage"element={<NoSQLPage />}/>
      </Routes>
    </Router>
  );
};

export default App;