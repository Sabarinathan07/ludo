import express, { Application, Request, Response } from "express";
import http from "http";
import socketIo, { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import gameRoutes from "./routes/gameRoutes";
import { handleSocketConnection } from "./services/gameService";
import dotenv from "dotenv";
import connectDB from "./config/gameConfig";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io: SocketIOServer = new socketIo.Server(server);

// Middleware
app.use(express.json());
app.use("/api/game", gameRoutes);

// connect DB
connectDB();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

// Socket connection for real-time gameplay
io.on("connection", (socket) => {
    console.log("New client connected");
    handleSocketConnection(socket, io);
    socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
