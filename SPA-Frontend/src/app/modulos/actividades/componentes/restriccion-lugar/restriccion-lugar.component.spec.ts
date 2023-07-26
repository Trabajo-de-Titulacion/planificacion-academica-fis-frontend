import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestriccionLugarComponent } from './restriccion-lugar.component';

describe('RestriccionLugarComponent', () => {
  let component: RestriccionLugarComponent;
  let fixture: ComponentFixture<RestriccionLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestriccionLugarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestriccionLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
