import React, { useState } from 'react';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';

// GraphQL Mutation to Register User
const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!, $role: String!) {
    registerUser(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
    }
  }
`;

// GraphQL Query to Fetch Users
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`;

function CreateUser() {
    const navigate = useNavigate();
    const [registerUser, { error, loading }] = useMutation(REGISTER_USER, {
        refetchQueries: [{ query: GET_USERS }],
    });
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!username || !email || !password) {
            setFormError("All fields are required.");
            return;
        }

        try {
            await registerUser({ variables: { username, email, password, role } });
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('User');
            navigate('/userlist');
        } catch (err) {
            setFormError("Error registering user. Please try again.");
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '20px' }}>
            <h2>Create User</h2>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {error && <Alert variant="danger">GraphQL Error: {error.message}</Alert>}
            {loading && <Alert variant="info">Registering User...</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                    Register
                </Button>
            </Form>
        </Container>
    );
}

export default CreateUser;
