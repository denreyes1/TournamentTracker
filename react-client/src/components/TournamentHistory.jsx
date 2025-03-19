import React, { useState } from 'react';
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

// GraphQL Mutation to Add a Movie
const ADD_MOVIE = gql`
  mutation AddMovie(
    $movieId: Int!,
    $title: String!,
    $year: Int!,
    $genre: String!,
    $description: String!,
    $rating: Float,
    $watched: Boolean
  ) {
    createMovie(
      movieId: $movieId,
      title: $title,
      year: $year,
      genre: $genre,
      description: $description,
      rating: $rating,
      watched: $watched
    ) {
      id
      movieId
      title
    }
  }
`;

function TournamentHistory() {
    const navigate = useNavigate();
    const [addMovie, { error, loading }] = useMutation(ADD_MOVIE);
    
    // State Hooks for Form Fields
    const [movieId, setMovieId] = useState('');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState('');
    const [watched, setWatched] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); // Reset previous errors

        // Validate inputs
        if (!movieId || !title || !year || !genre || !description) {
            setFormError("All fields except rating are required.");
            return;
        }

        try {
            await addMovie({
                variables: {
                    movieId: parseInt(movieId),
                    title,
                    year: parseInt(year),
                    genre,
                    description,
                    rating: rating ? parseFloat(rating) : null,
                    watched
                }
            });

            // Clear form fields
            setMovieId('');
            setTitle('');
            setYear('');
            setGenre('');
            setDescription('');
            setRating('');
            setWatched(false);

            // Navigate after success
            navigate('/movielist');
        } catch (err) {
            setFormError("Error adding movie. Please try again.");
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '20px' }}>
            <h2>Add Movie</h2>

            {formError && <Alert variant="danger">{formError}</Alert>}
            {error && <Alert variant="danger">GraphQL Error: {error.message}</Alert>}
            {loading && <Alert variant="info">Adding Movie...</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Movie Id</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Movie Id"
                        value={movieId}
                        onChange={(e) => setMovieId(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Rating (0-10)"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Check
                        type="checkbox"
                        label="Watched"
                        checked={watched}
                        onChange={(e) => setWatched(e.target.checked)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                    Save
                </Button>
            </Form>
        </Container>
    );
}

export default TournamentHistory;
