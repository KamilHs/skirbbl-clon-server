import express from "express";
import cors from "cors";
import helmet from "helmet";
import socketIO from "socket.io";

export const app = express();
export const io = new socketIO.Server();
const server = require("http").createServer(app);

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        credentials: true,
    })
);
app.use(helmet());

io.listen(server);
app.listen(process.env.PORT || 5555);
