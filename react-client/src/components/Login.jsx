import React, { useState } from "react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

// GraphQL Mutation for Login
const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      message
      user {
        id
        username
        role
      }
    }
  }
`;

// GraphQL Query to Fetch Player ID for a Given User
const GET_PLAYER_BY_USER = gql`
  query GetPlayerByUser($userId: ID!) {
    getPlayerByUser(userId: $userId) {
      user {
        username
        id
      }
      id
    }
  }
`;

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
    const [getPlayerByUser] = useLazyQuery(GET_PLAYER_BY_USER);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!username || !password) {
            setFormError("Please fill in all fields.");
            return;
        }

        try {
            const { data } = await loginUser({ variables: { username, password } });

            if (data?.loginUser?.user) {
                const userId = data.loginUser.user.id;
                const role = data.loginUser.user.role;

                // Store authentication details
                document.cookie = "token=loggedin; path=/";
                localStorage.setItem("token", "loggedin");
                localStorage.setItem("role", role);

                if (role === "Player") {
                    // Fetch player ID using userId
                    console.log("Attempting to fetch player by user id - ", userId);
                    getPlayerByUser({ variables: { userId: userId } })  // ✅ Fixed variable name
                        .then(({ data }) => {
                            const player = data?.getPlayerByUser;
                            if (player) {
                                console.log("Player ID:", player.id);
                                localStorage.setItem("playerId", player.id);
                            } else {
                                console.log("Player ID not found");
                            }
                            onLoginSuccess();
                            navigate("/home");
                        })
                        .catch((error) => {
                            console.error("Error fetching player ID:", error);
                        });
                } else {
                    onLoginSuccess();
                    navigate("/home");
                }
            }
        } catch (err) {
            console.error("Login Error:", err.networkError?.result || err);
            setFormError("Invalid credentials. Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: "50px" }}>
          <Card style={{ width: "50vw", maxWidth: "500px", padding: "32px" }}>
          <h2 style={{ marginTop: "20px", marginBottom: "12px" }}>Login</h2>

            {formError && <Alert variant="danger">{formError}</Alert>}
            {error && <Alert variant="danger">GraphQL Error: {error.message}</Alert>}
            {loading && <Alert variant="info">Logging in...</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    Login
                </Button>
            </Form>
            </Card>
        </Container>
    );
}

export default Login;
