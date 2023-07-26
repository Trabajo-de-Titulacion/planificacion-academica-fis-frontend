import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ExperimentacionService {

    constructor( private readonly httpClient: HttpClient){   
    }

    obtenerInfoExperimentacion(){
        const url = "http://localhost:3000/api/experimentacion";
        return this.httpClient.get(url)
    }

    obtenerInfo(){
        const url = "http://localhost:3000/api/experimentacion/info";
        return this.httpClient.get(url)
    }
    
}