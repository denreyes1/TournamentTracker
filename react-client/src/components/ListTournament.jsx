import React from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Container, Table, Alert } from "react-bootstrap";

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

function TournamentHistory() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_TOURNAMENTS);

  if (loading) return <Alert variant="info">Loading tournaments...</Alert>;
  if (error) return <Alert variant="danger">Error loading tournaments</Alert>;

  return (
    <Container style={{ marginTop: "20px" }}>
      <h2>Tournament History</h2>
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
          {data?.tournaments?.map((tournament) => (
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
              <td>
                {tournament.players.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "15px" }}>
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

export default TournamentHistory;
