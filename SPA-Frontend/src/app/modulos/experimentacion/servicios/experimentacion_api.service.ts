import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',

})
export class ExperimentacionService{

    constructor(private readonly httpclient: HttpClient){}

    obtenerInfoExperimentacion(){
        const url = 'http://localhost:3000/api/estudiante';
        return this.httpclient.get(url)
    }

    obtenerInfo(){
        const url = 'http://localhost:3000/api/estudiante/info';
        return this.httpclient.get(url)
    }
}