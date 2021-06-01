import { Perfil } from "./perfil.moldel";

export class Usuario {
    id: number;
    email: string;
    nome: string;
    senha: string;
    url: string;
    perfis:Perfil[];
}