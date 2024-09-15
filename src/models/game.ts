import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
    players: string[]; // Array of player usernames or IDs
    board: any[]; // Define board as per your game structure
    currentTurn: string;
    status: string;
}

const gameSchema: Schema = new mongoose.Schema({
    players: { type: [String], required: true },
    board: { type: Array, required: true },
    currentTurn: { type: String, required: true },
    status: { type: String, default: "waiting" },
});

const Game = mongoose.model<IGame>("Game", gameSchema);
export default Game;
