import React, { useState } from 'react';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Table, Card } from 'react-bootstrap';

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

function ListUser() {
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading) return <Alert variant="info">Loading users...</Alert>;
    if (error) return <Alert variant="danger">Error loading users: {error.message}</Alert>;

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ marginTop: "50px" }}>
          <Card style={{ width: "80vw", maxWidth: "1200px", padding: "32px" }}>
          <h2 style={{ marginTop: "20px", marginBottom: "12px" }}>User List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </Card>
        </Container>
    );
}

export default ListUser;
