import { Component } from "@angular/core";


@Component({
    selector: 'app-parametros-iniciales',
    templateUrl: './parametros-iniciales.component.html'
})
export class ParametrosInicialesComponent{
    constructor() {}

    semestres = [{abreviatura: "2022-a"}]

}