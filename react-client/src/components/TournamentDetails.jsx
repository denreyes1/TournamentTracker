import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Container, Button, Table, Alert, Form, ListGroup } from "react-bootstrap";

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
  const isPlayerJoined = tournament.players.some((player) => player.id === playerId);

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
            {role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tournament.players.map((player) => (
            <tr key={player.id}>
              <td>{player.user.username}</td>
              {role === "Admin" && (
                <td>
                  <Button onClick={() => handleRemovePlayer(player.id)} variant="danger" size="sm">
                    Remove
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {role === "Player" && (
        isPlayerJoined ? (
          <Button onClick={handleLeave} variant="danger">Leave Tournament</Button>
        ) : (
          <Button onClick={handleJoin} variant="primary">Join Tournament</Button>
        )
      )}

      {role === "Admin" && (
        <div>
          <h4>Add Player</h4>
          <Form.Control
            type="text"
            placeholder="Search for a player to add"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay hiding to allow clicking
          />

          {showDropdown && searchResults?.searchPlayers.length > 0 && (
            <ListGroup style={{ position: "absolute", width: "50%", zIndex: 10, backgroundColor: "white" }}>
              {searchResults.searchPlayers.map((player) => (
                <ListGroup.Item
                  key={player.user.id}
                  action
                  onClick={() => handleAddPlayer(player.id)}
                >
                    {player.user.username}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      )}
    </Container>
  );
}

export default TournamentDetails;
