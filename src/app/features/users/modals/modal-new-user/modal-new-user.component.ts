
import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ICreateUser, IUpdateUser } from '../../../../core/model/user';
import { RandomstringService } from '../../../../core/services/randomstring.service';
import { LibService } from '../../../../shared/services/lib.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-modal-new-user',
  templateUrl: './modal-new-user.component.html',
  styleUrls: ['./modal-new-user.component.css']
})
export class ModalNewUserComponent {

  validateForm!: UntypedFormGroup;

  @Output() onSubmit = new EventEmitter<any>();

  isOkLoading = false;
  isVisible = false;
  hospitals: any = [];
  zones: any = [];
  userId: any = '';

  constructor (
    private randomString: RandomstringService,
    private libService: LibService,
    private userService: UserService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      zoneCode: [null, [Validators.required]],
      hospcode: [null, [Validators.required]],
      enabled: [true]
    });

    // Get zones
    this.getZones();

  }

  showModal(id: any = ''): void {
    this.validateForm.reset()
    this.userId = id
    if (id) {
      this.getUserInfo(id)
    }

    this.isVisible = true
  }

  handleOk(): void {
    if (this.validateForm.valid) {
      if (this.userId) {
        let user: IUpdateUser = {
          first_name: this.validateForm.value.firstName,
          last_name: this.validateForm.value.lastName,
          email: this.validateForm.value.email,
          hospcode: this.validateForm.value.hospcode,
          enabled: this.validateForm.value.enabled ? 'Y' : 'N'
        }

        this.doUpdate(user)

      } else {
        let user: ICreateUser = {
          username: this.validateForm.value.username,
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

  async doRegister(user: ICreateUser) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.userService.save(user)
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

  async doUpdate(user: IUpdateUser) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.userService.update(this.userId, user)
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
    const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    try {
      const response: any = await this.userService.info(id);
      const user = response.data

      this.validateForm.patchValue({
        username: user.username,
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

      this.validateForm.controls['username'].disable()
      this.validateForm.controls['password'].disable()

      this.message.remove(messageId)
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

  async getHospitals(zoneCode: any) {
    const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
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
    const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    try {
      const response = await this.libService.getZones();
      this.zones = response.data.map((v: any) => {
        v.name = `${v.name} (${v.ingress_zone})`;
        return v;
      });
      this.message.remove(messageId);
    } catch (error: any) {
      this.message.remove(messageId);
      this.message.error(`${error.code} - ${error.message}`);
    }
  }

}
