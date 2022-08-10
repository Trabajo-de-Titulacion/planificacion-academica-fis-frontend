export interface Usuario {
    correo: string,
    roles: ("DOCENTE" | "COORDINADOR" | "SUBDECANO" | "GESTOR_ESPACIOS_FISICOS")[],
}