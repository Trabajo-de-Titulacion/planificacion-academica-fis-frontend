export interface CrearActividad {
    idTipoAula?: string;
    idDocente?: string;
    idAsignatura?: string;
    idGrupo?: string;
    duracion?: number;
}

export interface Actividad {
    idAula?: string;
    idTipoAula?: string;
    idDocente?: string;
    idAsignatura?: string;
    idGrupo?: string;
    duracion?: number;
}