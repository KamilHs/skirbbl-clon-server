import rooms, { GAME_CONFIG, ROOMS_LIMIT } from "../rooms";
import Game from "./classes/Game";
import Player from "./classes/Player";
import idGenerator from "../utils/idGenerator";
import { io } from "../servers";
import { CREATE_ROOM, GET_PLAYERS_DATA, JOIN_ROOM } from "./types";

const emitPlayersData = async (roomId: string) => {
    const socketIds = await io.in(roomId).allSockets();
    const playersData = rooms[roomId].getPlayersWithRoles();
    Array.from(socketIds).forEach((socketId) => {
        io.of("/")
            .sockets.get(socketId)
            ?.emit(
                GET_PLAYERS_DATA,
                playersData.map((data) => ({
                    nickname: data.nickname,
                    role: data.role,
                    isMe: data.socket.id === socketId,
                }))
            );
    });
};

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
            const { nickname } = data;
            const creator = new Player(socket, nickname, 0);
            rooms[id] = new Game(creator, [creator], id, GAME_CONFIG);
            socket.join(id);
            socket.emit(CREATE_ROOM, {
                roomId: id,
            });
            emitPlayersData(id);
        }
    });
    socket.on(JOIN_ROOM, async (data) => {
        console.log("join room");
        const { id, nickname } = data;
        if (id in rooms) {
            rooms[id].addPlayer(new Player(socket, nickname, 0));
            socket.join(id);
            emitPlayersData(id);
            socket.emit(JOIN_ROOM, {
                roomId: id,
            });
        } else {
            socket.emit(JOIN_ROOM, {
                error: true,
                message: "Invalid room",
            });
        }
    });
});

export default io;
