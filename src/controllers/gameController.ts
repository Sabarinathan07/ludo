import { Request, Response } from "express";
import Game, { IGame } from "../models/game";

// Create a new game
export const createGame = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const newGame = new Game({
            players: [req.body.player],
            board: [], // Initialize the board here
            currentTurn: req.body.player,
        });
        const game: IGame = await newGame.save();
        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Join an existing game
export const joinGame = async (req: Request, res: Response): Promise<void> => {
    try {
        const game: IGame | null = await Game.findById(req.body.gameId);
        if (game && game.players.length < 4) {
            game.players.push(req.body.player);
            await game.save();
            res.status(200).json(game);
        } else {
            res.status(400).json({ message: "Game is full or not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get game state
export const getGameState = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const game: IGame | null = await Game.findById(req.params.gameId);
        res.status(200).json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
