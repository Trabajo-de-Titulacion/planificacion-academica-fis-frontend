import { Facultad } from "./facultad.interface";

export default interface TipoAula {
  id?: string;
  tipo: string;
  facultad: Facultad;
}