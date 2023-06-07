import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmrUsersComponent } from './emr-users.component';

const routes: Routes = [{ path: '', component: EmrUsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmrUsersRoutingModule { }
