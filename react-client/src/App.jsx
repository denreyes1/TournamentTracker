import './App.css';

//
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
//
// This app requires react-bootstrap and bootstrap installed: 
//  npm install react-bootstrap bootstrap
//
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import './App.css';

import Home from './components/Home';

import TournamentHistory from './components/TournamentHistory';
import CreateUser from './components/CreateUser';
import CreateTournament from './components/CreateTournament';
import ListTournament from './components/ListTournament';
import ListUser from './components/ListUser';
import Login from './components/Login';

//
function App() {

  return (
    <Router>
      
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="home">Gaming Tournament System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home" >Home</Nav.Link>
              <Nav.Link as={Link} to="/tournamenthistory">Tournament History</Nav.Link> {/* User Only */}
              <Nav.Link as={Link} to="/createuser">Create User</Nav.Link> {/* Admin Only */}
              <Nav.Link as={Link} to="/createtournament">Create Tournament</Nav.Link> {/* Admin Only */}
              <Nav.Link as={Link} to="/listtournament">Tournament List</Nav.Link>
              <Nav.Link as={Link} to="/listuser">User List</Nav.Link> {/* Admin Only */}
              <Nav.Link as={Link} to="/login" >Login</Nav.Link>
              

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path = "home" element={<Home />} /> 
          <Route path = "tournamenthistory" element={<TournamentHistory/>} />
          <Route path = "createuser" element={<CreateUser/>} />
          <Route path = "createtournament" element={<CreateTournament/>} />
          <Route path = "listtournament" element={<ListTournament/>} />
          <Route path = "listuser" element={<ListUser/>} />
          <Route path = "login" element={<Login/>} />

        </Routes>
    </div>    
      

    </Router>


  );
}
//
export default App;
