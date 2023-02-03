import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ICreateHospital, IUpdateHospital } from '../../../../core/model/hospital';
import { LibService } from '../../../../shared/services/lib.service';
import { HospitalService } from '../../services/hospital.service';

@Component({
  selector: 'app-modal-new-hospital',
  templateUrl: './modal-new-hospital.component.html',
  styleUrls: ['./modal-new-hospital.component.css']
})
export class ModalNewHospitalComponent {

  validateForm!: UntypedFormGroup;

  @Output() onSubmit = new EventEmitter<any>();

  isOkLoading = false;
  isVisible = false;
  zones: any = [];
  hospcode: any = '';

  constructor (
    private libService: LibService,
    private hospitalService: HospitalService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      hospname: [null, [Validators.required]],
      zoneCode: [null, [Validators.required]],
      hospcode: [null, [Validators.required]],
      enabled: [true]
    });

    // Get zones
    this.getZones();

  }

  showModal(hospcode: any = ''): void {

    this.validateForm.reset()
    this.validateForm.controls['hospcode'].enable()
    this.hospcode = hospcode
    if (hospcode) {
      this.getHospitalInfo(hospcode)
    }

    this.isVisible = true
  }

  handleOk(): void {
    if (this.validateForm.valid) {
      if (this.hospcode) {
        let hospital: IUpdateHospital = {
          hospname: this.validateForm.value.hospname,
          zone_code: this.validateForm.value.zoneCode,
          enabled: this.validateForm.value.enabled ? 'Y' : 'N'
        }

        this.doUpdate(hospital)

      } else {
        let hospital: ICreateHospital = {
          zone_code: this.validateForm.value.zoneCode,
          hospname: this.validateForm.value.hospname,
          hospcode: this.validateForm.value.hospcode,
          enabled: this.validateForm.value.enabled ? 'Y' : 'N'
        }

        this.doRegister(hospital)

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

  async doRegister(hospital: ICreateHospital) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.hospitalService.save(hospital)
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

  async doUpdate(hospital: IUpdateHospital) {
    this.isOkLoading = true
    const messageId = this.message.loading('กำลังบันทึกข้อมูล...', { nzDuration: 0 }).messageId
    try {
      await this.hospitalService.update(this.hospcode, hospital)
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

  async getHospitalInfo(hospcode: any) {
    const messageId = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    try {
      const response: any = await this.hospitalService.info(hospcode);
      const hospital = response.data

      this.validateForm.patchValue({
        hospname: hospital.hospname,
        hospcode: hospital.hospcode,
        zoneCode: hospital.zone_code,
        enabled: hospital.enabled,
      })

      this.validateForm.controls['hospcode'].disable()

      this.message.remove(messageId)
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
