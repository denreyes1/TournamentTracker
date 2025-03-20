import React, { useState } from 'react';
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

// GraphQL Mutation to Register User
const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!, $role: String!) {
    registerUser(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
    }
  }
`;

// GraphQL Mutation to Create Player (Now includes `tournaments: []`)
const CREATE_PLAYER = gql`
  mutation CreatePlayer($userId: ID!, $ranking: Int!) {
    createPlayer(userId: $userId, ranking: $ranking) {
      id
      user {
        id
        username
      }
      ranking
    }
  }
`;

function CreateUser() {
    const navigate = useNavigate();
    const [registerUser, { error, loading }] = useMutation(REGISTER_USER);
    const [createPlayer] = useMutation(CREATE_PLAYER);
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Player');
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!username || !email || !password) {
            setFormError("All fields are required.");
            return;
        }

        console.log("Sending to GraphQL:", { username, email, password, role });

        try {
            const { data } = await registerUser({
                variables: { username, email, password, role }
            });

            if (!data?.registerUser?.id) {
                throw new Error("User ID is missing after registration.");
            }

            let userId = data.registerUser.id;
        
            try {
                // Ensure userId is a string before passing it to createPlayer
                userId = String(userId);
                console.log("Processed userId:", userId, "Type:", typeof userId);
    
                if (data.registerUser.role === "Player") {
                    console.log("Creating player for user ID:", userId);
                    await createPlayer({
                        variables: { userId, ranking: 0}
                    });
                }
            } catch (err) {
            }

            // Reset form
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
            
            console.log("User created successfully!");
            navigate('/home');
        } catch (err) {
            console.error("GraphQL Error:", err.networkError?.result || err);
            setFormError(err.message || "Error registering user. Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: "50px" }}>
          <Card style={{ width: "50vw", maxWidth: "500px", padding: "32px" }}>
          <h2 style={{ marginTop: "20px", marginBottom: "12px" }}>Create User</h2>
            {formError && <Alert variant="danger">{formError}</Alert>}
            {error && <Alert variant="danger">GraphQL Error: {error.message}</Alert>}
            {loading && <Alert variant="info">Registering User...</Alert>}
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
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email (e.g., user@example.com)" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
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

            <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control 
                    as="select" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="Player">Player</option>
                    <option value="Admin">Admin</option>
                </Form.Control>
            </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                    Register
                </Button>
            </Form>
            </Card>
        </Container>
    );
}

export default CreateUser;
