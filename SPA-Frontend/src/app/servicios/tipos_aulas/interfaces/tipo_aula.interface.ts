import { Facultad } from "../../facultades/interfaces/facultad.interface";

export interface TipoAula {
    id?: string;
    tipo: string;
    facultad: Facultad;
}