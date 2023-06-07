import { NzMessageService } from 'ng-zorro-antd/message';

import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { ICreateEMRUser, IUpdateEMRUser } from '../../../../core/model/emr_user';
import { RandomstringService } from '../../../../core/services/randomstring.service';
import { LibService } from '../../../../shared/services/lib.service';
import { EmrUserService } from '../../services/emr-user.service';

@Component({
  selector: 'app-modal-new-emr-user',
  templateUrl: './modal-new-emr-user.component.html',
  styleUrls: ['./modal-new-emr-user.component.css']
})
export class ModalNewEmrUserComponent {

  validateForm!: UntypedFormGroup;

  @Output() onSubmit = new EventEmitter<any>();

  isOkLoading = false;
  isVisible = false;
  hospitals: any = [];
  zones: any = [];
  userId: any = null;

  constructor (
    private randomString: RandomstringService,
    private libService: LibService,
    private emrUserService: EmrUserService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      cid: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      zoneCode: [null, [Validators.required]],
      hospcode: [null, [Validators.required]],
      enabled: [true]
    });

  }

  showModal(id: any = ''): void {
    this.validateForm.reset()
    this.validateForm.controls['cid'].enable()
    this.validateForm.controls['password'].enable()
    this.validateForm.controls['zoneCode'].enable()

    this.isVisible = true
    this.userId = null;

    if (id) {
      this.userId = id
      this.getUserInfo(id)
    }

    // Get zones
    this.getZones();

  }

  handleOk(): void {
    if (this.validateForm.valid) {
      if (this.userId) {
        let user: IUpdateEMRUser = {
          first_name: this.validateForm.value.firstName,
          last_name: this.validateForm.value.lastName,
          email: this.validateForm.value.email,
          hospcode: this.validateForm.value.hospcode,
          enabled: this.validateForm.value.enabled ? 'Y' : 'N'
        }

        this.doUpdate(user)

      } else {
        let user: ICreateEMRUser = {
          cid: this.validateForm.value.cid,
          password: this.validateForm.value.password,
          first_name: this.validateForm.value.firstName,
          last_name: this.validateForm.value.lastName,
          email: this.validateForm.value.email,
          hospcode: this.validateForm.value.hospcode,
          enabled: this.validateForm.value.enabled ? 'Y' : 'N'
        }

        this.doRegister(user)

      }
      return
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
      return
    }
  }

  handleCancel(): void {
    this.validateForm.reset()
    this.isOkLoading = false
    this.isVisible = false
  }

  async doRegister(user: ICreateEMRUser) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...').messageId
    try {
      await this.emrUserService.save(user)
      this.message.remove(messageId)
      this.isOkLoading = false
      this.isVisible = false
      this.onSubmit.emit(true)
    } catch (error: any) {
      this.isOkLoading = false
      this.message.remove(messageId)
      this.message.error(`${error.code} - ${error.message}`)
    }
  }

  async doUpdate(user: IUpdateEMRUser) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.emrUserService.update(this.userId, user)
      this.message.remove(messageId)
      this.isOkLoading = false
      this.isVisible = false
      this.onSubmit.emit(true);
    } catch (error: any) {
      this.isOkLoading = false
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  randomPassword() {
    const randomPassword = this.randomString.generateRandomString();
    this.validateForm.patchValue({ password: randomPassword });
  }

  onChangeProvince(event: any) {
    this.getHospitals(event);
  }

  async getUserInfo(id: any) {
    const messageId = this.message.loading('Loading...').messageId;
    try {
      const response: any = await this.emrUserService.info(id);
      const user = response.data

      this.validateForm.patchValue({
        cid: user.cid,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        zoneCode: user.zone_code,
        enabled: user.enabled,
      })

      // load hospitals
      this.getHospitals(user.zone_code)
      // patch value
      this.validateForm.patchValue({
        hospcode: user.hospcode,
      })

      this.validateForm.controls['cid'].disable()
      this.validateForm.controls['password'].disable()
      this.validateForm.controls['zoneCode'].disable()

      this.message.remove(messageId)
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  async getHospitals(zoneCode: any) {
    const messageId = this.message.loading('Loading...').messageId;
    try {
      const response = await this.libService.getHospitals(zoneCode);
      this.hospitals = response.data;
      this.message.remove(messageId);
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  async getZones() {
    const messageId = this.message.loading('Loading...').messageId;
    try {
      const response = await this.libService.getZones();
      this.zones = response.data.map((v: any) => {
        v.name = `${v.name}`;
        return v;
      });
      this.message.remove(messageId);
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

}
