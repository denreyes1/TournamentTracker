import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import Home from './components/Home';
import TournamentHistory from './components/TournamentHistory';
import CreateUser from './components/CreateUser';
import CreateTournament from './components/CreateTournament';
import ListTournament from './components/ListTournament';
import ListUser from './components/ListUser';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Wrap everything inside AppContent so useNavigate() works
function AppContent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check login status
  const checkLoginStatus = () => {
    const token = document.cookie.includes('token=loggedin') || localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/home">Gaming Tournament System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/tournamenthistory">Tournament History</Nav.Link>
              <Nav.Link as={Link} to="/createuser">Create User</Nav.Link>
              <Nav.Link as={Link} to="/createtournament">Create Tournament</Nav.Link>
              <Nav.Link as={Link} to="/listtournament">Tournament List</Nav.Link>
              <Nav.Link as={Link} to="/listuser">User List</Nav.Link>
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="tournamenthistory" element={<TournamentHistory />} />
          <Route path="createuser" element={<CreateUser />} />
          <Route path="createtournament" element={<CreateTournament />} />
          <Route path="listtournament" element={<ListTournament />} />
          <Route path="listuser" element={<ListUser />} />
          <Route path="login" element={<Login onLoginSuccess={checkLoginStatus} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
