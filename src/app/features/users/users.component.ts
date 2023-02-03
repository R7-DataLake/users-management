import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DateTime } from 'luxon';

import * as _ from 'lodash';

import { UserList } from '../../core/model/user';
import { ModalNewUserComponent } from './modals/modal-new-user/modal-new-user.component';
import { UserService } from './services/user.service';
import { LibService } from '../../shared/services/lib.service';
import { ModalChangePasswordComponent } from './modals/modal-change-password/modal-change-password.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  @ViewChild('mdlNewUser') private mdlNewUser!: ModalNewUserComponent;
  @ViewChild('mdlChangePassword') private mdlChangePassword!: ModalChangePasswordComponent;

  zoneCode: any = '';
  usersDataSet: UserList[] = [];
  zones: any = [];

  constructor (
    private router: Router,
    private userService: UserService,
    private libService: LibService,
    private message: NzMessageService) { }

  ngOnInit() {
    this.getUserList();
    this.getZones();
  }

  onBack(): void {
    this.router.navigate(['/dashboard'])
  }

  openEditUser(id: any) {
    this.mdlNewUser.showModal(id)
  }

  openNewUserRegister() {
    this.mdlNewUser.showModal()
  }

  onSubmitRegister(event: any) {
    if (event) {
      this.getUserList()
    }
  }

  onChangeZone(event: any) {
    this.zoneCode = event;
    this.getUserList();
  }

  changePassword(id: any) {
    this.mdlChangePassword.showModal(id)
  }

  async getZones() {
    // const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    try {
      const response = await this.libService.getZones();
      this.zones = response.data.map((v: any) => {
        v.name = `${v.name} (${v.ingress_zone})`;
        return v;
      });
      // this.message.remove(messageId);
    } catch (error: any) {
      // this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  async getUserList() {
    const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    try {
      const response = await this.userService.getUserList(this.zoneCode);
      this.usersDataSet = response.data.map((v: any) => {
        const date = v.last_login ? DateTime.fromISO(v.last_login).setLocale('th').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) : '';
        v.last_login = date;
        return v;
      });
      this.message.remove(messageId);
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }
}
