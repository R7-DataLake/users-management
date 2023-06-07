import { Component, ViewChild } from '@angular/core';
import { UserList } from '../../core/model/user';
import { Router } from '@angular/router';
import { LibService } from '../../shared/services/lib.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DateTime } from 'luxon';
import { ModalNewEmrUserComponent } from './modals/modal-new-emr-user/modal-new-emr-user.component';
import { EmrUserService } from './services/emr-user.service';
import { EMRUserList } from '../../core/model/emr_user';
import { ModalEmrChangePasswordComponent } from './modals/modal-emr-change-password/modal-emr-change-password.component';

@Component({
  selector: 'app-emr-users',
  templateUrl: './emr-users.component.html',
  styleUrls: ['./emr-users.component.css']
})
export class EmrUsersComponent {

  @ViewChild('mdlNewUser') private mdlNewUser!: ModalNewEmrUserComponent;
  @ViewChild('mdlChangePassword') private mdlChangePassword!: ModalEmrChangePasswordComponent;

  zoneCode: any = '';
  usersDataSet: EMRUserList[] = [];
  zones: any = [];

  constructor (
    private router: Router,
    private userService: EmrUserService,
    private libService: LibService,
    private message: NzMessageService,
    private modal: NzModalService) { }

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

  changePassword(user: any) {
    this.mdlChangePassword.showModal(user.id, user.cid)
  }

  async getZones() {
    // const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    try {
      const response = await this.libService.getZones();
      this.zones = response.data.map((v: any) => {
        v.name = `${v.name}`;
        return v;
      });
      // this.message.remove(messageId);
    } catch (error: any) {
      // this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  async getUserList() {
    const messageId = this.message.loading('Loading...').messageId;
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

  async confirmDelete(user: any) {
    this.modal.confirm({
      nzTitle: 'ยืนยันยกเลิกรายการ?',
      nzContent: `ต้องการยกเลิกรายการผู้ใช้งานนี้ (${user.first_name} ${user.last_name}) ใช่หรือไม่?`,
      nzOkText: 'ใช่',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this._doDeleteUser(user.id),
      nzCancelText: 'ไม่ใช่',
      nzOnCancel: () => { }
    });
  }

  private async _doDeleteUser(id: any) {
    const messageId = this.message.loading('Loading...').messageId;
    try {
      await this.userService.delete(id);
      this.message.remove(messageId);
      this.message.success('ยกเลิกรายการเรียบร้อย');
      this.getUserList();
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  async confirmCancelDelete(user: any) {
    this.modal.confirm({
      nzTitle: 'ยืนยัน?',
      nzContent: `ต้องการให้รายการนี้ (${user.first_name} ${user.last_name}) กลับมาใช้งานได้อีก ใช่หรือไม่?`,
      nzOkText: 'ใช่',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this._doCancelDelete(user.id),
      nzCancelText: 'ไม่ใช่',
      nzOnCancel: () => { }
    });
  }

  private async _doCancelDelete(id: any) {
    const messageId = this.message.loading('Loading...').messageId;
    try {
      await this.userService.cancelDelete(id);
      this.message.remove(messageId);
      this.message.success('รายการนี้สามารถกลับมาใช้ได้ใหม่อีกครั้ง');
      this.getUserList();
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

}
