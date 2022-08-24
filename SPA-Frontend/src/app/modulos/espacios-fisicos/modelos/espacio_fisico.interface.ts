import { TipoAula } from "../../parametros-iniciales/models/tipo-aula.interface";

export interface EspacioFisico {
    id?: string;
    nombre: string;
    tipo_id?: string;
    tipo?: TipoAula;
    aforo: number;
}