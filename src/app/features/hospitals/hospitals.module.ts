import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalsRoutingModule } from './hospitals-routing.module';
import { HospitalsComponent } from './hospitals.component';
import { NgZorroModule } from '../../ng-zorro.module';
import { ModalNewHospitalComponent } from './modals/modal-new-hospital/modal-new-hospital.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HospitalsComponent,
    ModalNewHospitalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroModule,
    HospitalsRoutingModule
  ]
})
export class HospitalsModule { }
