import { IPadLoop } from "../../pad-loop/interfaces/pad-loop.interface";

export interface ISession {
    id: string;
    title: string;
    padLoops: IPadLoop[];
}