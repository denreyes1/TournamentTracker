import React, { useState } from 'react';
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

// GraphQL Mutation for Creating a Tournament
const CREATE_TOURNAMENT = gql`
  mutation CreateTournament(
    $name: String!,
    $game: String!,
    $date: String!,
    $status: String!
  ) {
    createTournament(name: $name, game: $game, date: $date, status: $status) {
      id
      name
      game
      date
      status
    }
  }
`;

function CreateTournament() {
    const navigate = useNavigate();
    const [createTournament, { error, loading }] = useMutation(CREATE_TOURNAMENT);

    // State Hooks for Form Fields
    const [name, setName] = useState('');
    const [game, setGame] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('Upcoming');
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!name || !game || !date || !status) {
            setFormError("All fields are required.");
            return;
        }

        try {
            await createTournament({
                variables: { name, game, date, status }
            });

            // Clear form fields
            setName('');
            setGame('');
            setDate('');
            setStatus('Upcoming');

            // Navigate to tournament list
            navigate('/tournamentlist');
        } catch (err) {
            setFormError("Error creating tournament. Please try again.");
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '20px' }}>
            <h2>Create Tournament</h2>

            {formError && <Alert variant="danger">{formError}</Alert>}
            {error && <Alert variant="danger">GraphQL Error: {error.message}</Alert>}
            {loading && <Alert variant="info">Creating Tournament...</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tournament Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Game</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Game Name"
                        value={game}
                        onChange={(e) => setGame(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                    Create Tournament
                </Button>
            </Form>
        </Container>
    );
}

export default CreateTournament;
