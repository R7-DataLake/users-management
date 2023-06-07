import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EmrUserService } from '../../services/emr-user.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-modal-emr-change-password',
  templateUrl: './modal-emr-change-password.component.html',
  styleUrls: ['./modal-emr-change-password.component.css']
})
export class ModalEmrChangePasswordComponent {
  validateForm!: UntypedFormGroup;

  isVisible = false;
  isOkLoading = false;

  userId: any;

  constructor (
    private userService: EmrUserService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      cid: [null, []],
      password: [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  showModal(id: any, cid: any): void {
    this.validateForm.reset()
    this.userId = id
    this.isVisible = true

    this.validateForm.controls['cid'].disable()

    this.validateForm.patchValue({
      cid: cid,
    })


  }

  handleOk(): void {
    if (this.validateForm.valid) {
      const password = this.validateForm.value.password
      this.doChangePassword(this.userId, password)
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
    this.isVisible = false;
  }

  async doChangePassword(id: any, password: any) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.userService.changePassword(id, password)
      this.message.remove(messageId)

      this.message.success('ดำเนินการเสร็จเรียบร้อย')
      this.isOkLoading = false
      this.isVisible = false
    } catch (error: any) {
      this.isOkLoading = false
      this.message.remove(messageId)
      this.message.error(`${error.code} - ${error.message}`)
    }
  }
}
