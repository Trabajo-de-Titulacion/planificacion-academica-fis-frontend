import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-tipo-aula-dialog',
  templateUrl: './crear-tipo-aula-dialog.component.html',
  styleUrls: ['./crear-tipo-aula-dialog.component.scss']
})
export class CrearTipoAulaDialogComponent implements OnInit {

  constructor(
    public dialogRef : MatDialogRef<CrearTipoAulaDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  onNoClick() : void {
    this.dialogRef.close();
  }
 

}
