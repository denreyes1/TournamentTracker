import React from 'react';
import { gql, useQuery } from "@apollo/client";
import { Container, Table, Alert } from 'react-bootstrap';

// GraphQL Query to Fetch Tournaments with Players
const GET_TOURNAMENTS = gql`
  query GetTournaments {
    tournaments {
      id
      name
      game
      date
      status
      players {
        id
        user {
          username
        }
      }
    }
  }
`;

function ListTournament() {
    const { data, loading, error } = useQuery(GET_TOURNAMENTS);

    if (loading) return <Alert variant="info">Loading tournaments...</Alert>;
    if (error) return <Alert variant="danger">Error loading tournaments</Alert>;

    return (
        <Container style={{ marginTop: '20px' }}>
            <h2>List of Tournaments</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Game</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {data.tournaments.map((tournament) => (
                        <tr key={tournament.id}>
                            <td>{tournament.name}</td>
                            <td>{tournament.game}</td>
                            <td>{new Date(tournament.date).toLocaleDateString()}</td>
                            <td>{tournament.status}</td>
                            <td>
                                {tournament.players.length > 0 ? (
                                    <ul>
                                        {tournament.players.map((player) => (
                                            <li key={player.id}>{player.user.username}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    "No Players"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ListTournament;
