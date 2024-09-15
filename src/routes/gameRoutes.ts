import { Router } from "express";
import {
    createGame,
    joinGame,
    getGameState,
} from "../controllers/gameController";

const gameRoutes: Router = Router();

gameRoutes.post("/create", createGame);
gameRoutes.post("/join", joinGame);
gameRoutes.get("/:gameId", getGameState);

export default gameRoutes;
