import { Socket } from "socket.io";

export enum PlayerType {
    admin,
    member,
}

export interface IPlayerData {
    nickname: string;
    role: PlayerType;
}

class Player {
    constructor(
        private socket: Socket,
        private nickname: string,
        private score: number
    ) {}

    getNickname() {
        return this.nickname;
    }

    getSocket() {
        return this.socket;
    }
}

export default Player;
