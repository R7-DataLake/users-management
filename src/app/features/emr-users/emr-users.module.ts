import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmrUsersRoutingModule } from './emr-users-routing.module';
import { EmrUsersComponent } from './emr-users.component';
import { NgZorroModule } from '../../ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalNewEmrUserComponent } from './modals/modal-new-emr-user/modal-new-emr-user.component';
import { ModalEmrChangePasswordComponent } from './modals/modal-emr-change-password/modal-emr-change-password.component';


@NgModule({
  declarations: [
    EmrUsersComponent,
    ModalNewEmrUserComponent,
    ModalEmrChangePasswordComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    FormsModule,
    ReactiveFormsModule,
    EmrUsersRoutingModule
  ]
})
export class EmrUsersModule { }
