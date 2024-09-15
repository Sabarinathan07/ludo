import { Server as SocketIOServer, Socket, Server } from "socket.io";
import Game, { IGame } from "../models/game";


const handleSocketConnection1 = (socket: Socket, io: Server) => {
    console.log("New client connected:", socket.id);

    // Event for joining a lobby
    socket.on("join_lobby", (lobbyId: string, username: string) => {
        // Check if lobby exists
        let lobby = lobbies.get(lobbyId);
        if (!lobby) {
            lobby = { id: lobbyId, users: new Map() };
            lobbies.set(lobbyId, lobby);
        }

        // Add user to the lobby
        const user: User = { id: socket.id, username };
        lobby.users.set(socket.id, user);

        // Notify the lobby that a new user has joined
        io.to(lobbyId).emit("lobby_update", Array.from(lobby.users.values()));

        // Join the socket to the lobby room
        socket.join(lobbyId);
        console.log(`User ${username} joined lobby ${lobbyId}`);
    });

    // Event for leaving a lobby
    socket.on("leave_lobby", (lobbyId: string) => {
        const lobby = lobbies.get(lobbyId);
        if (lobby) {
            // Remove user from the lobby
            lobby.users.delete(socket.id);

            // Notify the lobby that a user has left
            io.to(lobbyId).emit(
                "lobby_update",
                Array.from(lobby.users.values())
            );

            // Leave the socket from the lobby room
            socket.leave(lobbyId);
            console.log(`User ${socket.id} left lobby ${lobbyId}`);

            // If no users are in the lobby, delete the lobby
            if (lobby.users.size === 0) {
                lobbies.delete(lobbyId);
            }
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // Remove user from all lobbies
        lobbies.forEach((lobby) => {
            if (lobby.users.has(socket.id)) {
                lobby.users.delete(socket.id);
                io.to(lobby.id).emit(
                    "lobby_update",
                    Array.from(lobby.users.values())
                );
            }
        });

        // Optionally clean up empty lobbies
        lobbies.forEach((lobby, lobbyId) => {
            if (lobby.users.size === 0) {
                lobbies.delete(lobbyId);
            }
        });
    });
};

export { handleSocketConnection };
// Handle real-time game events
export const handleSocketConnection = (
    socket: Socket,
    io: SocketIOServer
): void => {
    socket.on(
        "rollDice",
        async ({ gameId, playerId }: { gameId: string; playerId: string }) => {
            const diceRoll: number = Math.floor(Math.random() * 6) + 1;

            // Update the game state with the dice roll and broadcast to players
            const game: IGame | null = await Game.findById(gameId);
            if (game && game.currentTurn === playerId) {
                // Logic for updating board based on diceRoll
                io.in(gameId).emit("updateGameState", { game, diceRoll });
                // Logic for switching turn
            }
        }
    );

    // Handle other game events (move piece, etc.)
};

