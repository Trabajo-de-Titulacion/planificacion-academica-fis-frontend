import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestriccionTiempoComponent } from './restriccion-tiempo.component';

describe('RestriccionTiempoComponent', () => {
  let component: RestriccionTiempoComponent;
  let fixture: ComponentFixture<RestriccionTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestriccionTiempoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestriccionTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
