import Game, { IGameConfig } from "src/sockets/classes/Game";

export const ROOMS_LIMIT = 10;

export interface IRooms {
    [key: string]: Game;
}

const rooms: IRooms = {};

export const GAME_CONFIG: IGameConfig = {
    roundTime: 90,
    rounds: 5,
};

export default rooms;
