const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.server.model');
const Player = require('../models/player.server.model');
const Tournament = require('../models/tournament.server.model');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const resolvers = {
    Query: {
        // Fetch all users
        users: async () => await User.find(),

        // Fetch a user by ID
        user: async (_, { id }) => await User.findById(id),

        // Fetch all players
        players: async () => await Player.find().populate('user tournaments'),

        // Fetch a player by ID
        player: async (_, { id }) => await Player.findById(id).populate('user tournaments'),

        // Fetch a player by userId
        getPlayerByUser: async (_, { userId }) => {
            console.log("Received userId:", userId);
        
            try {
                const uid = new ObjectId(userId);
                console.log("Converted userId to ObjectId:", uid);
        
                const player = await Player.findOne({ user: uid }).populate('user tournaments');
                console.log("Queried player:", player);
        
                if (!player) {
                    console.error("Player not found in database");
                    throw new Error("Player not found");
                }
        
                return player;
            } catch (error) {
                console.error("Error in getPlayerByUser resolver:", error);
                throw new Error("Internal server error");
            }
        },
        
        // Fetch all tournaments
        tournaments: async () => await Tournament.find().populate('players'),

        // Fetch a tournament by ID
        tournament: async (_, { id }) => await Tournament.findById(id).populate('players'),

        // Check authenticated user (JWT token required)
        me: async (_, __, { req }) => {
            const token = req.cookies.token;
            if (!token) throw new Error("Not authenticated");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return await User.findById(decoded.id);
        }
    },

    Mutation: {
        // Register a new user
        registerUser: async (_, { username, email, password, role }) => {
            const existingUser = await User.findOne({ username });
            if (existingUser) throw new Error("User already exists");
        
            if (!password) throw new Error("Password is required");
        
            const hashedPassword = await bcrypt.hash(password.trim(), 10);
        
            const user = new User({ username, email, password: hashedPassword, role });
            await user.save();
        
            return user;
        },                   
        
        // Login user and set JWT cookie
        loginUser: async (_, { username, password }, { res }) => {
            console.log("Login attempt for:", username);
        
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error("User not found");
            }
        
            const isValid = await bcrypt.compare(password, user.password);
        
            if (!isValid) {
                throw new Error("Invalid credentials");
            }
        
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });
        
            console.log("User logged in successfully");
            return { message: "Logged in successfully", user };
        },

        // Logout user (clear JWT cookie)
        logoutUser: (_, __, { res }) => {
            res.clearCookie('token');
            return { message: "Logged out successfully" };
        },

        // Create a player
        createPlayer: async (_, { userId, ranking }) => {
            console.error("createPlayer...")
            const user = await User.findById(userId);
            if (!user) throw new Error("User not found");

            console.error("Attempting to save user")
            const player = new Player({ user: userId, ranking });
            await player.save();
            return player;
        },

        // Create a tournament
        createTournament: async (_, { name, game, date, status }) => {
            const tournament = new Tournament({ name, game, date, status });
            await tournament.save();
            return tournament;
        },

        // Add a player to a tournament
        addPlayerToTournament: async (_, { tournamentId, playerId }) => {
            const tournament = await Tournament.findById(new ObjectId(tournamentId));
            const player = await Player.findById(new ObjectId(playerId));

            if (!tournament || !player) throw new Error("Tournament or Player not found");

            if (!tournament.players.includes(playerId)) {
                tournament.players.push(playerId);
                await tournament.save();
            }

            if (!player.tournaments.includes(tournamentId)) {
                player.tournaments.push(tournamentId);
                await player.save();
            }

            return tournament;
        },

        // Update tournament status
        updateTournamentStatus: async (_, { tournamentId, status }) => {
            const tournament = await Tournament.findByIdAndUpdate(tournamentId, { status }, { new: true });
            if (!tournament) throw new Error("Tournament not found");
            return tournament;
        },

        // Delete a tournament
        deleteTournament: async (_, { tournamentId }) => {
            const tournament = await Tournament.findByIdAndDelete(tournamentId);
            if (!tournament) throw new Error("Tournament not found");
            return { message: "Tournament deleted successfully" };
        }
    }
};

module.exports = resolvers;
