import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Home() {
  const isLoggedIn = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {isLoggedIn ? (
        <>
          <h2>
            Hey, <span style={{ color: "blue", fontWeight: "bold" }}>{username}</span>! Welcome to Gaming Tournament System!
          </h2>
        </>
      ) : (
        <>
          <h2>Welcome to Gaming Tournament System</h2>
          <div style={{ marginTop: "15px" }}>
            <Button
              variant="primary"
              onClick={() => navigate(`/login`)}
              style={{ marginRight: "10px" }}
            >
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/createuser`)}>
              Sign Up
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
