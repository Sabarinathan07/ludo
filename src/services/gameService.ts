import { Server as SocketIOServer, Socket } from "socket.io";
import Game, { IGame } from "../models/game";

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

