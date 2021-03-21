import rooms, { GAME_CONFIG, ROOMS_LIMIT } from "../rooms";
import Game from "./classes/Game";
import Player from "./classes/Player";
import idGenerator from "../utils/idGenerator";
import { io } from "../servers";
import {
    CREATE_ROOM,
    GET_PLAYERS_DATA,
    JOIN_ROOM,
    SEND_MESSAGE,
    START_GAME,
    IMessage,
    MessageType,
    GET_MESSAGE,
} from "./types";

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
                    score: data.score,
                    isDrawer: data.isDrawer,
                }))
            );
    });
};

io.on("connection", (socket) => {
    socket.on(CREATE_ROOM, ({ nickname }) => {
        console.log("create room");
        if (Object.keys(rooms).length >= ROOMS_LIMIT) {
            socket.emit(CREATE_ROOM, {
                error: true,
                message: "Maximum number of rooms reached",
            });
        } else {
            const id = idGenerator(20);
            const creator = new Player(socket, nickname, 0);
            rooms[id] = new Game(creator, [creator], id, GAME_CONFIG);
            socket.join(id);
            socket.emit(CREATE_ROOM, {
                roomId: id,
            });
            emitPlayersData(id);
        }
    });
    socket.on(JOIN_ROOM, ({ id, nickname }) => {
        console.log("join room");
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
    socket.on(START_GAME, ({ roomId }) => {
        const room = rooms[roomId];
        if (room && room.isCreator(socket) && !room.getIsStarted()) {
            room.setIsStarted(true);
            io.in(roomId).emit(START_GAME, roomId);
        }
    });
    socket.on(SEND_MESSAGE, ({ message }) => {
        const roomId = Array.from(socket.rooms.values()).pop() || "";
        const room = rooms[roomId];
        if (room) {
            const author = room.getPlayer(socket);
            if (author) {
                const newMessage: IMessage = {
                    id: Math.random().toString(),
                    content: message,
                    type: MessageType.guessing,
                    authorName: author.getNickName(),
                };
                io.in(roomId).emit(GET_MESSAGE, newMessage);
            }
        }
    });
    socket.on("disconnecting", async () => {
        const roomId = Array.from(socket.rooms.values()).pop() || "";
        const isCreator = rooms[roomId]?.isCreator(socket);
        rooms[roomId]?.removePlayer(socket);
        if (rooms[roomId]?.getPlayersCount() === 0) {
            delete rooms[roomId];
        } else {
            if (isCreator) {
                rooms[roomId]?.updateCreator();
            }
            emitPlayersData(roomId);
        }
    });
});

export default io;
