import { TipoAula } from "../../tipos_aulas/interfaces/tipo_aula.interface";

export interface EspacioFisico {
    id?: string;
    nombre: string;
    tipo_id?: string;
    tipo?: TipoAula;
    aforo: number;
}