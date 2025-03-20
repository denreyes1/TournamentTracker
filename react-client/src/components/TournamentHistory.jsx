import React from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Container, Table, Alert } from "react-bootstrap";

const GET_PLAYER_BY_USER = gql`
  query Player($playerId: ID!) {
    player(id: $playerId) {
        tournaments {
            id
            name
            game
            date
            status
            }
        }
    }
`;

function TournamentHistory() {
  const playerId = localStorage.getItem("playerId");
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_PLAYER_BY_USER, {
    variables: { playerId },
  });

  if (loading) return <Alert variant="info">Loading tournaments...</Alert>;
  if (error) return <Alert variant="danger">Error loading tournaments</Alert>;
  if (!data?.player?.tournaments.length) {
    return <Alert variant="warning">No tournaments joined.</Alert>;
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <h2>Joined Tournaments</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Game</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.player.tournaments.map((tournament) => (
            <tr
              key={tournament.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/tournament/${tournament.id}`)}
            >
              <td>{tournament.name}</td>
              <td>{tournament.game}</td>
              <td>
                {new Date(Number(tournament.date)).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td>{tournament.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default TournamentHistory;
