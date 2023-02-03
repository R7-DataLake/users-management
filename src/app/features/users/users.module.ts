import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NgZorroModule } from '../../ng-zorro.module';
import { ModalNewUserComponent } from './modals/modal-new-user/modal-new-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalChangePasswordComponent } from './modals/modal-change-password/modal-change-password.component';


@NgModule({
  declarations: [
    UsersComponent,
    ModalNewUserComponent,
    ModalChangePasswordComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
