import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.css']
})
export class ModalChangePasswordComponent {

  validateForm!: UntypedFormGroup;

  isVisible = false;
  isOkLoading = false;

  userId: any;

  constructor (
    private userService: UserService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(4)]],
    })
  }

  showModal(id: any): void {
    this.validateForm.reset()
    this.userId = id
    this.isVisible = true
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
