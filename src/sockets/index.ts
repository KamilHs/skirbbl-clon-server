import rooms, { GAME_CONFIG, ROOMS_LIMIT } from "../rooms";
import Game from "./classes/Game";
import Player from "./classes/Player";
import idGenerator from "../utils/idGenerator";
import { io } from "../servers";
import { CREATE_ROOM } from "./types";

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on(CREATE_ROOM, (data) => {
        console.log("create room");
        if (Object.keys(rooms).length >= ROOMS_LIMIT) {
            socket.emit(CREATE_ROOM, {
                error: true,
                message: "Maximum number of rooms reached",
            });
        } else {
            const id = idGenerator(20);
            const { nickname } = data.nickname;
            const creator = new Player(socket, nickname, 0);
            rooms[id] = new Game(creator, [creator], id, GAME_CONFIG);
            socket.join(id);
            socket.emit(CREATE_ROOM, {
                roomId: id,
            });
        }
    });
});

export default io;
