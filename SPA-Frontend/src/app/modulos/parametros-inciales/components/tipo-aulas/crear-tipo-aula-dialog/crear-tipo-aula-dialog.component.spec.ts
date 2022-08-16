import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoAulaDialogComponent } from './crear-tipo-aula-dialog.component';

describe('CrearTipoAulaDialogComponent', () => {
  let component: CrearTipoAulaDialogComponent;
  let fixture: ComponentFixture<CrearTipoAulaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearTipoAulaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTipoAulaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
