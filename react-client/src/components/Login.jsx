import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

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

function Login() {
  const navigate = useNavigate();
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  // State for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!username || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { username, password },
      });

      if (data?.loginUser?.user) {
        // Redirect to dashboard or homepage after login
        navigate("/dashboard");
      }
    } catch (err) {
      setFormError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "30px" }}>
      <h2>Login</h2>

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
    </Container>
  );
}

export default Login;
