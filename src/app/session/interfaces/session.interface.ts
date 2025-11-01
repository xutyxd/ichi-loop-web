import { IPadLoop } from "../../pad-loop/interfaces/pad-loop.interface";

export interface ISession {
    uuid: string;
    title: string;
    padLoops: IPadLoop[];
}