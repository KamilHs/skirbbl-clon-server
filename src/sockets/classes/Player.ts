import { Socket } from "socket.io";

export enum PlayerType {
    admin,
    member,
}

export interface IPlayerData {
    nickname: string;
    role: PlayerType;
    score: number;
    isDrawer: boolean;
    socket: Socket;
}

class Player {
    constructor(
        private socket: Socket,
        private nickname: string,
        private score: number
    ) {}

    getPlayerData(): IPlayerData {
        return {
            nickname: this.nickname,
            role: PlayerType.member,
            socket: this.socket,
            score: this.score,
            isDrawer: false,
        };
    }

    getSocket() {
        return this.socket;
    }

    getNickName() {
        return this.nickname;
    }
}

export default Player;
