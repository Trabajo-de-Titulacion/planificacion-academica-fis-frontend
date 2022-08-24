import { Docente } from "../../docentes/modelos/docente.interface";
import JornadaLaboral from "../../parametros-inciales/models/jornada-laboral.interface";

export interface HoraNoDisponible {
    id?: string;
    hora_inicio: number;
    // Docente
    docente?: Docente;
    docente_id?: string;
    // Jornada
    dia?: JornadaLaboral;
    dia_id?: string;
}