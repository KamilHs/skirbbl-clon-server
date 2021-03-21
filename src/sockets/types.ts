export const CREATE_ROOM = "CREATE_ROOM";
export const JOIN_ROOM = "JOIN_ROOM";
export const GET_PLAYERS_DATA = "GET_PLAYERS_DATA";
export const START_GAME = "START_GAME";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const GET_MESSAGE = "GET_MESSAGE";

export enum MessageType {
    join,
    leave,
    guessed,
    guessing,
    guess,
}

export interface IMessage {
    id: string;
    type: MessageType;
    authorName: string;
    content: string;
}
