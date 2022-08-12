export interface Usuario {
    correo: string,
    roles: ("DOCENTE" | "COORDINADOR" | "SUBDECANO")[],
}