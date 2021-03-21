import { Socket } from "socket.io";

class Player {
    constructor(
        private socket: Socket,
        private nickname: string,
        private score: number
    ) {}
}

export default Player;
