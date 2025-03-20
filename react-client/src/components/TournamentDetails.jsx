import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Container, Button, Table, Alert } from "react-bootstrap";

const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
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

const JOIN_TOURNAMENT = gql`
  mutation JoinTournament($tournamentId: ID!, $playerId: ID!) {
    addPlayerToTournament(tournamentId: $tournamentId, playerId: $playerId) {
      id
    }
  }
`;

const LEAVE_TOURNAMENT = gql`
  mutation LeaveTournament($tournamentId: ID!, $playerId: ID!) {
    leaveTournament(tournamentId: $tournamentId, playerId: $playerId) {
      id
    }
  }
`;

function TournamentDetails() {
  const role = localStorage.getItem("role");
  const playerId = localStorage.getItem("playerId");
  const { id } = useParams();
  const { data, loading, error, refetch } = useQuery(GET_TOURNAMENT, {
    variables: { id },
  });
  const [joinTournament] = useMutation(JOIN_TOURNAMENT);
  const [leaveTournament] = useMutation(LEAVE_TOURNAMENT);

  if (loading) return <Alert variant="info">Loading tournament details...</Alert>;
  if (error) return <Alert variant="danger">Error loading tournament</Alert>;

  const tournament = data.tournament;

  // Check if the current player is already in the tournament
  const isPlayerJoined = tournament.players.some((player) => player.id === playerId);

  const handleJoin = async () => {
    try {
      await joinTournament({ variables: { tournamentId: id, playerId } });
      refetch();
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveTournament({ variables: { tournamentId: id, playerId } });
      refetch();
    } catch (error) {
      console.error("Error leaving tournament:", error);
    }
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <h2>{tournament.name}</h2>
      <p>
        <strong>Game:</strong> {tournament.game}
      </p>
      <p>
        <strong>Date:</strong> {new Date(Number(tournament.date)).toLocaleDateString("en-US")}
      </p>
      <p>
        <strong>Status:</strong> {tournament.status}
      </p>
      <h4>Players</h4>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {tournament.players.length > 0 ? (
            tournament.players.map((player) => (
              <tr key={player.id}>
                <td>{player.user.username}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="1" style={{ textAlign: "center" }}>No one has joined yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
      {role === "Player" && (
        isPlayerJoined ? (
          <Button onClick={handleLeave} variant="danger">
            Leave Tournament
          </Button>
        ) : (
          <Button onClick={handleJoin} variant="primary">
            Join Tournament
          </Button>
        )
      )}
    </Container>
  );
}

export default TournamentDetails;
