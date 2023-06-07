import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmrUsersComponent } from './emr-users.component';

describe('EmrUsersComponent', () => {
  let component: EmrUsersComponent;
  let fixture: ComponentFixture<EmrUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmrUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmrUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
