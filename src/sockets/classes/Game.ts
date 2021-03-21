import { Socket } from "socket.io";

import Player, { IPlayerData, PlayerType } from "./Player";

export interface IGameConfig {
    rounds: number;
    roundTime: number;
}
class Game {
    private timeout: ReturnType<typeof setTimeout> | null = null;
    private currentPlayer: Player | null = null;
    private currentWord: string | null = null;
    private currentRound: number = 0;
    private isStarted: boolean = false;
    constructor(
        private creator: Player,
        private players: Player[],
        private id: string,
        private config: IGameConfig
    ) {}

    getPlayersWithRoles(): IPlayerData[] {
        return this.players.map((player) => ({
            ...player.getPlayerData(),
            role:
                player.getSocket().id === this.creator.getSocket().id
                    ? PlayerType.admin
                    : PlayerType.member,
        }));
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }
    removePlayer(socket: Socket) {
        this.players = this.players.filter(
            (player) => player.getSocket().id !== socket.id
        );
    }

    isCreator(socket: Socket) {
        return socket.id === this.creator.getSocket().id;
    }
    updateCreator() {
        this.creator = this.players[0] || null;
    }

    getPlayersCount() {
        return this.players.length;
    }

    getIsStarted() {
        return this.isStarted;
    }

    setIsStarted(isStarted: boolean) {
        this.isStarted = isStarted;
    }

    getPlayer(socket: Socket) {
        return this.players.find(
            (player) => player.getSocket().id === socket.id
        );
    }
}

export default Game;
