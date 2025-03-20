import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Container, Button, Table, Alert, Form, ListGroup, Card } from "react-bootstrap";

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
        ranking
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

const SEARCH_PLAYERS = gql`
  query SearchPlayers($username: String!) {
    searchPlayers(username: $username) {
      id
      user {
        id
        username
      }
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: searchResults } = useQuery(SEARCH_PLAYERS, {
    variables: { username: searchQuery },
    skip: !searchQuery,
  });

  if (loading) return <Alert variant="info">Loading tournament details...</Alert>;
  if (error) return <Alert variant="danger">Error loading tournament</Alert>;

  const tournament = data.tournament;
  const isCompleted = tournament.status === "Completed";
  const isPlayerJoined = tournament.players.some((player) => player.id === playerId);
  const isPlayerListEmpty = tournament.players.length === 0;

  const handleJoin = async () => {
    await joinTournament({ variables: { tournamentId: id, playerId } });
    refetch();
  };

  const handleLeave = async () => {
    await leaveTournament({ variables: { tournamentId: id, playerId } });
    refetch();
  };

  const handleRemovePlayer = async (playerIdToRemove) => {
    await leaveTournament({ variables: { tournamentId: id, playerId: playerIdToRemove } });
    refetch();
  };

  const handleAddPlayer = async (selectedPlayerId) => {
    await joinTournament({ variables: { tournamentId: id, playerId: selectedPlayerId } });
    setSearchQuery(""); // Clear search box
    setShowDropdown(false); // Hide dropdown
    refetch();
  };

  const existingPlayerIds = new Set(tournament.players.map((player) => player.id));

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: "50px" }}>
      <Card style={{ width: "80vw", maxWidth: "1200px", padding: "32px" }}>
        <h3 className="text-center">{tournament.name}</h3>
        <p className="text-center">
          <strong>Game:</strong> {tournament.game} | <strong>Date:</strong>{" "}
          {new Date(Number(tournament.date)).toLocaleDateString("en-US")} | <strong>Status:</strong>{" "}
          {tournament.status}
        </p>

        {/* Players Header and Search Bar in Same Line */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Players</h5>
          {role === "Admin" && !isCompleted && (
            <div style={{ width: "250px" }}>
              <Form.Control
                type="text"
                placeholder="Search for a player to add"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />

              {showDropdown && searchResults?.searchPlayers.length > 0 && (
                <ListGroup style={{ position: "absolute", width: "250px", zIndex: 10, backgroundColor: "white" }}>
                  {searchResults.searchPlayers
                    .filter((player) => !existingPlayerIds.has(player.id))
                    .map((player) => (
                      <ListGroup.Item key={player.user.id} action onClick={() => handleAddPlayer(player.id)}>
                        {player.user.username}
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              )}
            </div>
          )}
        </div>

        {isPlayerListEmpty ? (
          <Alert variant="warning">No players have joined the tournament.</Alert>
        ) : (
          <Table striped bordered>
            <thead>
              <tr>
                <th>Username</th>
                <th>Rank</th>
                {role === "Admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tournament.players.map((player, index) => (
                <tr key={player.id}>
                  <td>{player.user.username}</td>
                  <td>{player.ranking}</td>
                  {role === "Admin" && (
                    <td style={{ width: "1px", whiteSpace: "nowrap" }}>
                      <Button onClick={() => handleRemovePlayer(player.id)} variant="danger" size="sm">
                        Remove
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {role === "Player" && (
          <Button onClick={isCompleted ? null : isPlayerJoined ? handleLeave : handleJoin} variant={isCompleted ? "secondary" : isPlayerJoined ? "danger" : "primary"} className="w-100" disabled={isCompleted}>
            {isCompleted ? "Tournament has completed" : isPlayerJoined ? "Leave Tournament" : "Join Tournament"}
          </Button>
        )}
      </Card>
    </Container>
  );
}

export default TournamentDetails;
