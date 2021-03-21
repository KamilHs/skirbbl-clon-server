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
}

export default Game;
