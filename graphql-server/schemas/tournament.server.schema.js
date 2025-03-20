const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # User type
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
    }

    # Player type
    type Player {
        id: ID!
        user: User!
        ranking: Int!
        tournaments: [Tournament]
    }

    # Tournament type
    type Tournament {
        id: ID!
        name: String!
        game: String!
        date: String!
        players: [Player]
        status: String!
    }

    # Auth response type
    type AuthPayload {
        message: String!
        user: User
    }

    # Generic response
    type Response {
        message: String!
    }

    # Queries (Fetching Data)
    type Query {
        users: [User]
        user(id: ID!): User
        players: [Player]
        player(id: ID!): Player
        getPlayerByUser(userId: ID!): Player
        tournaments: [Tournament]
        tournament(id: ID!): Tournament
        me: User
    }

    # Mutations (Modifying Data)
    type Mutation {
        registerUser(username: String!, email: String!, password: String!, role: String!): User
        loginUser(username: String!, password: String!): AuthPayload
        logoutUser: Response

        createPlayer(userId: ID!, ranking: Int!): Player
        createTournament(name: String!, game: String!, date: String!, status: String!): Tournament
        addPlayerToTournament(tournamentId: ID!, playerId: ID!): Tournament
        updateTournamentStatus(tournamentId: ID!, status: String!): Tournament
        deleteTournament(tournamentId: ID!): Response
    }
`;

module.exports = typeDefs;
