import { Time } from "./time.model";

export class Campeonato{

    id:number;
    nome:string;
    idCriador:number;
    nomeCriador:string;
    idCampeao:number;
    nomeCampeao:string;
    idVice:number;
    nomeVice:string;
    idTerceiro:number;
    nomeTerceiro:string;
    idQuarto:number;
    nomeQuarto:string;
    url:string;
    times_id:Number[];
    times:Time[];
}